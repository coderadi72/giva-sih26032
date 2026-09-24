const farmers = [
  {
    id: "FR-20481",
    name: "Ramesh Kumar",
    crop: "Wheat",
    quantity: 48,
    token: "3821",
    centreId: "C001",
    slot: "2026-09-20T10:30:00+05:30",
    procurementStatus: "Scheduled",
    paymentStatus: "Pending",
    expectedValue: 115200
  },
  {
    id: "FR-20510",
    name: "Sita Bai",
    crop: "Wheat",
    quantity: 32,
    token: "3822",
    centreId: "C001",
    slot: "2026-09-20T11:00:00+05:30",
    procurementStatus: "Scheduled",
    paymentStatus: "Pending",
    expectedValue: 76800
  }
];

const centres = [
  { id:"C001", name:"Sehore Procurement Centre", district:"Sehore", distance:"3.2 km", queue:32, load:64, avgMinutes:7, capacity:50, status:"Low" },
  { id:"C002", name:"Ashta Mandi Centre", district:"Sehore", distance:"7.4 km", queue:74, load:81, avgMinutes:7, capacity:91, status:"Medium" },
  { id:"C003", name:"Bhopal Rural Centre", district:"Bhopal", distance:"11.1 km", queue:164, load:94, avgMinutes:8, capacity:175, status:"High" }
];

const notifications = [
  { id:1, title:"Procurement schedule confirmed", text:"Your wheat procurement slot is confirmed for 20 September at 10:30 AM.", time:"Today, 6:42 PM" },
  { id:2, title:"Centre crowd is currently low", text:"Sehore Procurement Centre currently has 32 farmers in queue.", time:"Today, 5:20 PM" },
  { id:3, title:"Payment tracking ready", text:"Payment status will update after your procurement is completed.", time:"Today, 4:10 PM" }
];

module.exports = { farmers, centres, notifications };
