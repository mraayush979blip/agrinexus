import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Your Firebase Config (Using the one you provided)
const firebaseConfig = {
  apiKey: "AIzaSyCSLLZvcEIB9Un1FrRSr6YscnOQfnhn4RI",
  authDomain: "cloud-console-f73aa.firebaseapp.com",
  projectId: "cloud-console-f73aa",
  storageBucket: "cloud-console-f73aa.firebasestorage.app",
  messagingSenderId: "318811403063",
  appId: "1:318811403063:web:07cb0279dca9ba00dae0b2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const mandiPrices = [
  { name: "Patanjali Agri Hub", location: "Haridwar, UK", price: "₹4,850", rating: "4.9", trend: "+12%" },
  { name: "ITC Choupal Saagar", location: "Sehore, MP", price: "₹4,600", rating: "4.7", trend: "+5%" },
  { name: "Reliance Fresh Mandi", location: "Indore, MP", price: "₹4,720", rating: "4.8", trend: "+8%" }
];

const rentals = [
  { name: "Mahindra Arjun 605", type: "Tractor", price: "₹650/hr", owner: "Suresh Patel", rating: "4.9", distance: "1.5 km", img: "https://images.unsplash.com/photo-1594411133547-49339e31d451" },
  { name: "DJI Agras T40", type: "Drone", price: "₹1,500/acre", owner: "SkyFarm Solns", rating: "5.0", distance: "3.2 km", img: "https://images.unsplash.com/photo-1508614589041-895b88991e3e" },
  { name: "Sonalika Tiger 50", type: "Tractor", price: "₹550/hr", owner: "Vikram Singh", rating: "4.6", distance: "0.8 km", img: "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea" }
];

async function seed() {
  console.log("🚀 Starting database seed...");
  
  try {
    for (const item of mandiPrices) {
      await addDoc(collection(db, "mandi_prices"), item);
      console.log(`✅ Added Mandi Price: ${item.name}`);
    }

    for (const item of rentals) {
      await addDoc(collection(db, "rentals"), item);
      console.log(`✅ Added Rental: ${item.name}`);
    }

    console.log("✨ Database successfully seeded!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
