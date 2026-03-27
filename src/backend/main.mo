import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Float "mo:core/Float";
import Int "mo:core/Int";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";

actor {
  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.id.toNat(), product2.id.toNat());
    };

    public func compareByPrice(product1 : Product, product2 : Product) : Order.Order {
      Float.compare(product1.price, product2.price);
    };

    public func compareByCategory(product1 : Product, product2 : Product) : Order.Order {
      switch (Text.compare(product1.category, product2.category)) {
        case (#equal) { Float.compare(product1.price, product2.price) };
        case (order) { order };
      };
    };
  };

  let _productIdMap = Map.empty<Int, Product>();
  let _orderIdMap = Map.empty<Int, Order>();
  let _categoryMap = Map.empty<Text, List.List<Product>>();
  let _featuredProducts = List.empty<Product>();

  var _nextProductId = 0;
  var _nextOrderId = 0;

  var stripeSecretKey : Text = "";

  // Authentication system with role-based access control.
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  // --- Stripe Integration ---

  public shared ({ caller }) func setStripeSecretKey(key : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeSecretKey := key;
  };

  public shared query ({ caller = _ }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func createStripeCheckout(
    _customerName : Text,
    _customerEmail : Text,
    items : [OrderItem],
    successUrl : Text,
    cancelUrl : Text,
  ) : async Text {
    if (stripeSecretKey == "") {
      Runtime.trap("Stripe is not configured. Please set the Stripe secret key in the admin panel.");
    };

    let config : Stripe.StripeConfiguration = {
      secretKey = stripeSecretKey;
      allowedCountries = ["US", "CA", "GB", "AU", "DE", "FR"];
    };

    let shoppingItems = items.map(func(item : OrderItem) : Stripe.ShoppingItem {
      let productName = switch (_productIdMap.get(item.productId)) {
        case (?p) { p.name };
        case (null) { "Product #" # item.productId.toText() };
      };
      {
        currency = "usd";
        productName;
        productDescription = productName;
        priceInCents = Int.abs((item.price * 100.0).toInt());
        quantity = item.quantity.toNat();
      };
    });

    await Stripe.createCheckoutSession(config, caller, shoppingItems, successUrl, cancelUrl, transform);
  };

  public shared ({ caller = _ }) func getStripeSessionStatus(sessionId : Text) : async Text {
    if (stripeSecretKey == "") {
      Runtime.trap("Stripe is not configured.");
    };
    let config : Stripe.StripeConfiguration = {
      secretKey = stripeSecretKey;
      allowedCountries = [];
    };
    let status = await Stripe.getSessionStatus(config, sessionId, transform);
    switch (status) {
      case (#completed({ response; userPrincipal = _ })) { response };
      case (#failed({ error })) { Runtime.trap("Stripe error: " # error) };
    };
  };

  // --- Product Management ---

  public shared ({ caller }) func addProduct(input : ProductInput) : async Int {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let id = _nextProductId;
    _nextProductId += 1;

    let product = {
      input with
      id;
    };

    _addProductInternal(product);
    id;
  };

  func _addProductInternal(product : Product) {
    let (category, productId) = (product.category, product.id);

    _productIdMap.add(productId, product);

    var categoryList = switch (_categoryMap.get(category)) {
      case (null) { List.empty<Product>() };
      case (?existing) { existing };
    };
    categoryList.add(product);
    _categoryMap.add(category, categoryList);

    if (product.featured) {
      _featuredProducts.add(product);
    };
  };

  public shared ({ caller }) func updateProduct(productId : Int, product : ProductInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let newProduct = {
      product with
      id = productId;
    };

    switch (_productIdMap.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?existingProduct) {
        _productIdMap.add(productId, newProduct);

        switch (_categoryMap.get(existingProduct.category)) {
          case (?categoryList) {
            let categoryIter = categoryList.values();
            let newCategoryList = List.empty<Product>();
            categoryIter.forEach(func(item) { if (item.id != productId) { newCategoryList.add(item) } });
            _categoryMap.add(existingProduct.category, newCategoryList);
          };
          case (null) {};
        };

        var newCategoryList = switch (_categoryMap.get(newProduct.category)) {
          case (null) { List.empty<Product>() };
          case (?existing) { existing };
        };
        newCategoryList.add(newProduct);
        _categoryMap.add(newProduct.category, newCategoryList);

        let featuredIter = _featuredProducts.values();
        let filteredFeatured = List.empty<Product>();
        featuredIter.forEach(func(item) { if (item.id != productId) { filteredFeatured.add(item) } });
        _featuredProducts.clear();
        let filteredIter = filteredFeatured.values();
        filteredIter.forEach(func(item) { _featuredProducts.add(item) });
        if (newProduct.featured) { _featuredProducts.add(newProduct) };
      };
    };
  };

  public shared ({ caller }) func deleteProduct(productId : Int) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (_productIdMap.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        _productIdMap.remove(productId);

        switch (_categoryMap.get(product.category)) {
          case (?categoryList) {
            let categoryIter = categoryList.values();
            let newCategoryList = List.empty<Product>();
            categoryIter.forEach(func(item) { if (item.id != productId) { newCategoryList.add(item) } });
            _categoryMap.add(product.category, newCategoryList);

            if (newCategoryList.isEmpty()) {
              _categoryMap.remove(product.category);
            };
          };
          case (null) {};
        };

        let featuredIter = _featuredProducts.values();
        let filteredFeatured = List.empty<Product>();
        featuredIter.forEach(func(item) { if (item.id != productId) { filteredFeatured.add(item) } });
        _featuredProducts.clear();
        let filteredIter = filteredFeatured.values();
        filteredIter.forEach(func(item) { _featuredProducts.add(item) });
      };
    };
  };

  public query ({ caller = _ }) func getProductById(productId : Int) : async ?Product {
    _productIdMap.get(productId);
  };

  public query ({ caller = _ }) func getAllProducts() : async [Product] {
    _productIdMap.values().toArray().sort();
  };

  public query ({ caller = _ }) func getProductsByCategory(category : Text) : async [Product] {
    switch (_categoryMap.get(category)) {
      case (null) { [] };
      case (?categoryList) { categoryList.toArray() };
    };
  };

  public query ({ caller = _ }) func getFeaturedProducts() : async [Product] {
    _featuredProducts.toArray();
  };

  public query ({ caller = _ }) func getProductsByCategoryAndPriceRange(category : Text, minPrice : Float, maxPrice : Float) : async [Product] {
    switch (_categoryMap.get(category)) {
      case (null) { [] };
      case (?categoryList) {
        let filteredList = categoryList.values().toArray().filter(func(p) { p.price >= minPrice and p.price <= maxPrice });
        filteredList.sort(Product.compareByPrice);
      };
    };
  };

  public query ({ caller = _ }) func getProductsByPriceRange(minPrice : Float, maxPrice : Float) : async [Product] {
    let filteredArray = _productIdMap.values().toArray().filter(func(p) { p.price >= minPrice and p.price <= maxPrice });
    filteredArray.sort(Product.compareByPrice);
  };

  public query ({ caller = _ }) func getAllProductsSortedByCategory() : async [Product] {
    _productIdMap.values().toArray().sort(Product.compareByCategory);
  };

  // --- Order Management ---

  public shared ({ caller }) func placeOrder(customerName : Text, customerEmail : Text, items : [OrderItem]) : async Int {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    let orderId = _nextOrderId;
    _nextOrderId += 1;

    let total = items.foldLeft(0.0, func(acc, item) { acc + (item.price * item.quantity.toFloat()) });

    let order : Order = {
      id = orderId;
      items;
      total;
      customerEmail;
      customerName;
      status = "Processing";
      createdAt = Time.now();
    };

    _orderIdMap.add(orderId, order);
    orderId;
  };

  public query ({ caller }) func getOrderById(orderId : Int) : async ?Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    _orderIdMap.get(orderId);
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    _orderIdMap.values().toArray();
  };

  public query ({ caller = _ }) func getOrderCount() : async Int {
    _orderIdMap.size();
  };

  public query ({ caller = _ }) func getProductCount() : async Int {
    _productIdMap.size();
  };

  // --- Types ---

  public type Product = {
    id : Int;
    name : Text;
    brand : Text;
    category : Text;
    price : Float;
    description : Text;
    imageUrl : Text;
    stock : Nat;
    featured : Bool;
  };

  public type ProductInput = {
    name : Text;
    brand : Text;
    category : Text;
    price : Float;
    description : Text;
    imageUrl : Text;
    stock : Nat;
    featured : Bool;
  };

  public type Order = {
    id : Int;
    items : [OrderItem];
    total : Float;
    customerEmail : Text;
    customerName : Text;
    status : Text;
    createdAt : Int;
  };

  public type OrderItem = {
    productId : Int;
    quantity : Int;
    price : Float;
  };

  func seedProducts() {
    let products = [
      {
        name = "Balenciaga Track Sneakers";
        brand = "Balenciaga";
        category = "Sneakers";
        price = 4.99;
        description = "Iconic chunky sole sneakers with technical mesh and overlapping panels. A bold statement in luxury sportswear.";
        imageUrl = "/assets/generated/balenciaga-track.dim_600x600.jpg";
        stock = 10;
        featured = true;
      },
      {
        name = "Balenciaga Runner Sneakers";
        brand = "Balenciaga";
        category = "Sneakers";
        price = 4.99;
        description = "Retro-inspired running silhouette with distressed finish. Comfort meets avant-garde design.";
        imageUrl = "/assets/generated/balenciaga-runner.dim_600x600.jpg";
        stock = 8;
        featured = true;
      },
      {
        name = "Meta Ray-Ban Smart Glasses";
        brand = "Meta";
        category = "Accessories";
        price = 4.99;
        description = "Open-ear speakers, built-in camera, and hands-free calling in a classic Ray-Ban frame. Tech meets style.";
        imageUrl = "/assets/generated/meta-smart-glasses.dim_600x600.jpg";
        stock = 15;
        featured = false;
      },
      {
        name = "Dior B30 Sneakers";
        brand = "Dior";
        category = "Sneakers";
        price = 4.99;
        description = "Ultra-refined mesh and leather sneaker. The B30 elevates everyday movement to runway-worthy elegance.";
        imageUrl = "/assets/generated/dior-b30.dim_600x600.jpg";
        stock = 5;
        featured = true;
      },
      {
        name = "Dior B22 Sneakers";
        brand = "Dior";
        category = "Sneakers";
        price = 4.99;
        description = "Monogram-accented technical sneaker blending couture craftsmanship with contemporary street energy.";
        imageUrl = "/assets/generated/dior-b22.dim_600x600.jpg";
        stock = 7;
        featured = true;
      },
      {
        name = "Sp5der Hoodie";
        brand = "Sp5der";
        category = "Hoodies";
        price = 4.99;
        description = "Web-graphic heavyweight fleece hoodie. Worn by the culture, defined by the streets.";
        imageUrl = "/assets/generated/sp5der-hoodie.dim_600x600.jpg";
        stock = 20;
        featured = true;
      },
      {
        name = "Amiri MX1 Jeans";
        brand = "Amiri";
        category = "Jeans";
        price = 4.99;
        description = "Hand-distressed denim with leather biker patches. Rock and roll luxury for the modern wardrobe.";
        imageUrl = "/assets/generated/amiri-jeans.dim_600x600.jpg";
        stock = 12;
        featured = true;
      },
      {
        name = "Canada Goose Parka";
        brand = "Canada Goose";
        category = "Jackets";
        price = 4.99;
        description = "The ultimate cold-weather luxury. Arctic-grade down fill, signature coyote fur trim, and iconic disc badge. Built for the extreme, styled for the street.";
        imageUrl = "/assets/generated/canada-goose-jacket.dim_600x600.jpg";
        stock = 8;
        featured = true;
      },
      {
        name = "Moncler Down Jacket";
        brand = "Moncler";
        category = "Jackets";
        price = 4.99;
        description = "French Alpine luxury in quilted form. Lightweight goose down insulation, clean silhouette, and the iconic Moncler badge. Outerwear elevated to art.";
        imageUrl = "/assets/generated/moncler-jacket.dim_600x600.jpg";
        stock = 6;
        featured = true;
      },
      {
        name = "Hellstar Hoodie";
        brand = "Hellstar";
        category = "Hoodies";
        price = 4.99;
        description = "Heavyweight fleece with bold graphic print. Hellstar represents the duality of dark culture and street luxury — worn by the few who understand.";
        imageUrl = "/assets/generated/hellstar-hoodie.dim_600x600.jpg";
        stock = 15;
        featured = true;
      },
    ];

    for (input in products.values()) {
      let id = _nextProductId;
      _nextProductId += 1;

      let product = {
        input with
        id;
      };

      _addProductInternal(product);
    };
  };

  public shared func seedProductsOnce() : async () {
    if (_productIdMap.isEmpty()) {
      seedProducts();
    };
  };
};
