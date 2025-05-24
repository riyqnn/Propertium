import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Hash "mo:base/Hash";
import Blob "mo:base/Blob";

actor {
  // Token balances
  var balances : HashMap.HashMap<Principal, Nat> = HashMap.HashMap<Principal, Nat>(
    10,
    Principal.equal,
    func(p: Principal) : Nat32 { Principal.hash(p) } // Use Principal.hash directly
  );
  stable var stableBalances : [(Principal, Nat)] = [];

  // Property data
  public type Property = {
    id: Nat;
    title: Text;
    location: Text;
    price: Nat; // In PROPX
    priceUSD: Text;
    propertyType: Text;
    bedrooms: Nat;
    bathrooms: Nat;
    area: Text;
    coordinates: [Float];
    image: Text;
    nftStatus: Text;
    rating: Float;
    features: [Text];
  };

  var properties : HashMap.HashMap<Nat, Property> = HashMap.HashMap<Nat, Property>(
    10,
    Nat.equal,
    func(n: Nat) : Nat32 { Nat32.fromNat(n) }
  );
  stable var stableProperties : [(Nat, Property)] = [];
  var nextPropertyId : Nat = 1;

  // Initialize sample properties
  func initializeProperties() {
    let sampleProperties : [Property] = [
      {
        id = 1;
        title = "Luxury Villa Jakarta Selatan";
        location = "Kemang, Jakarta Selatan";
        price = 2500;
        priceUSD = "$8,750";
        propertyType = "Villa";
        bedrooms = 4;
        bathrooms = 3;
        area = "350 m²";
        coordinates = [-6.2615, 106.8106];
        image = "🏰";
        nftStatus = "Available";
        rating = 4.8;
        features = ["Swimming Pool", "Garden", "Garage", "Security"];
      },
      {
        id = 2;
        title = "Modern Apartment Sudirman";
        location = "Sudirman, Jakarta Pusat";
        price = 1800;
        priceUSD = "$6,300";
        propertyType = "Apartment";
        bedrooms = 2;
        bathrooms = 2;
        area = "120 m²";
        coordinates = [-6.2088, 106.8456];
        image = "🏢";
        nftStatus = "Available";
        rating = 4.6;
        features = ["City View", "Gym", "Parking", "Mall Access"];
      },
      {
        id = 3; // Fixed duplicate ID
        title = "Traditional House Yogyakarta";
        location = "Malioboro, Yogyakarta";
        price = 1200;
        priceUSD = "$4,200";
        propertyType = "House";
        bedrooms = 3;
        bathrooms = 2;
        area = "200 m²";
        coordinates = [-7.7956, 110.3695];
        image = "🏠";
        nftStatus = "Sold";
        rating = 4.5;
        features = ["Traditional Design", "Central Location", "Cultural Area"];
      },
    ];

    for (property in sampleProperties.vals()) {
      properties.put(property.id, property);
      nextPropertyId := property.id + 1;
    };
  };

  if (properties.size() == 0) {
    initializeProperties();
  };

  system func preupgrade() {
    stableBalances := Iter.toArray(balances.entries());
    stableProperties := Iter.toArray(properties.entries());
  };

  system func postupgrade() {
    balances := HashMap.fromIter<Principal, Nat>(
      stableBalances.vals(),
      10,
      Principal.equal,
      func(p: Principal) : Nat32 { Principal.hash(p) }
    );
    properties := HashMap.fromIter<Nat, Property>(
      stableProperties.vals(),
      10,
      Nat.equal,
      func(n: Nat) : Nat32 { Nat32.fromNat(n) }
    );
    stableBalances := [];
    stableProperties := [];
  };

  public shared({ caller }) func register() : async Result.Result<(), Text> {
    if (balances.get(caller) == null) {
      balances.put(caller, 10000);
      return #ok(());
    };
    #err("User already registered")
  };

  public shared({ caller }) func getBalance() : async Nat {
    switch (balances.get(caller)) {
      case (null) { 0 };
      case (?balance) { balance };
    }
  };

  public shared({ caller }) func transfer(to: Principal, amount: Nat) : async Result.Result<(), Text> {
    switch (balances.get(caller)) {
      case (null) { #err("Sender not registered") };
      case (?senderBalance) {
        if (senderBalance < amount) {
          return #err("Insufficient balance");
        };
        switch (balances.get(to)) {
          case (null) { #err("Recipient not registered") };
          case (?recipientBalance) {
            balances.put(caller, senderBalance - amount);
            balances.put(to, recipientBalance + amount);
            #ok(())
          };
        }
      };
    }
  };

  public query func getProperties() : async [Property] {
    Iter.toArray(properties.vals())
  };

  public shared({ caller }) func purchaseProperty(propertyId: Nat) : async Result.Result<(), Text> {
    switch (properties.get(propertyId)) {
      case (null) { #err("Property not found") };
      case (?property) {
        if (property.nftStatus != "Available") { return #err("Property not available") };
        switch (balances.get(caller)) {
          case (null) { #err("Sender not registered") };
          case (?senderBalance) {
            let price = property.price;
            if (senderBalance < price) { return #err("Insufficient balance") };
            let owner = Principal.fromText("ajuq4-ruaaa-aaaaa-qaaga-cai");
            switch (balances.get(owner)) {
              case (null) { #err("Owner not registered") };
              case (?ownerBalance) {
                balances.put(caller, senderBalance - price);
                balances.put(owner, ownerBalance + price);
                properties.put(propertyId, { property with nftStatus = "Sold" });
                #ok(())
              };
            }
          };
        }
      };
    }
  };
};