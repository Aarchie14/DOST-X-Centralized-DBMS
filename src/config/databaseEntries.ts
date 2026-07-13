// src/config/databaseEntries.ts

/**
 * Interface representing a single entry/row within a project's database table.
 */
export interface DatabaseEntry {
  entryId: number;
  beneficiaryName: string;
  location: string;
  contactNumber: string;
  dateRegistered: string;
  amountGranted: number;
  remarks: string;
}

/**
 * Column definition for rendering the database table headers and field keys.
 */
export interface ColumnDef {
  key: keyof DatabaseEntry;
  label: string;
  type: "text" | "number" | "date";
  editable: boolean;
}

/**
 * Column configuration for the database detail view table.
 */
export const DATABASE_COLUMNS: ColumnDef[] = [
  { key: "entryId", label: "Entry ID", type: "number", editable: false },
  { key: "beneficiaryName", label: "Beneficiary Name", type: "text", editable: true },
  { key: "location", label: "Location", type: "text", editable: true },
  { key: "contactNumber", label: "Contact Number", type: "text", editable: true },
  { key: "dateRegistered", label: "Date Registered", type: "date", editable: true },
  { key: "amountGranted", label: "Amount Granted (PHP)", type: "number", editable: true },
  { key: "remarks", label: "Remarks", type: "text", editable: true },
];

/**
 * Mock database entries keyed by project ID.
 * Each project maps to an array of beneficiary/entry records for wireframing.
 */
export const MOCK_DATABASE_ENTRIES: Record<number, DatabaseEntry[]> = {
  // Project 1: SETUP Exhibit at Camiguin
  1: [
    {
      entryId: 1,
      beneficiaryName: "Maria Santos Food Products",
      location: "Mambajao, Camiguin",
      contactNumber: "0917-123-4567",
      dateRegistered: "2026-01-15",
      amountGranted: 25000,
      remarks: "Food processing equipment provided",
    },
    {
      entryId: 2,
      beneficiaryName: "Juan dela Cruz Handicrafts",
      location: "Catarman, Camiguin",
      contactNumber: "0918-234-5678",
      dateRegistered: "2026-02-20",
      amountGranted: 18000,
      remarks: "Weaving tools and materials",
    },
    {
      entryId: 3,
      beneficiaryName: "Camiguin Dried Fish Coop",
      location: "Guinsiliban, Camiguin",
      contactNumber: "0919-345-6789",
      dateRegistered: "2026-03-10",
      amountGranted: 32000,
      remarks: "Solar dryer installation",
    },
    {
      entryId: 4,
      beneficiaryName: "Lanzones Valley Enterprise",
      location: "Sagay, Camiguin",
      contactNumber: "0920-456-7890",
      dateRegistered: "2026-04-05",
      amountGranted: 25000,
      remarks: "Packaging and labeling support",
    },
  ],

  // Project 2: JLSS Examination
  2: [
    {
      entryId: 1,
      beneficiaryName: "Ana Marie Villanueva",
      location: "Cagayan de Oro City",
      contactNumber: "0921-567-8901",
      dateRegistered: "2026-01-08",
      amountGranted: 15000,
      remarks: "BS Chemistry scholar — Semester 1",
    },
    {
      entryId: 2,
      beneficiaryName: "Mark Anthony Ramos",
      location: "Iligan City",
      contactNumber: "0922-678-9012",
      dateRegistered: "2026-01-10",
      amountGranted: 15000,
      remarks: "BS Biology scholar — Semester 1",
    },
    {
      entryId: 3,
      beneficiaryName: "Christine Joy Mendoza",
      location: "Bukidnon",
      contactNumber: "0923-789-0123",
      dateRegistered: "2026-01-12",
      amountGranted: 15000,
      remarks: "BS IT scholar — awaiting grades",
    },
  ],

  // Project 3: 2026 RSTW Northern Mindanao Venue at Camiguin
  3: [
    {
      entryId: 1,
      beneficiaryName: "CDO Convention Center",
      location: "Cagayan de Oro City",
      contactNumber: "0924-890-1234",
      dateRegistered: "2026-02-01",
      amountGranted: 80000,
      remarks: "Venue rental — main hall",
    },
    {
      entryId: 2,
      beneficiaryName: "NorMin Catering Services",
      location: "Cagayan de Oro City",
      contactNumber: "0925-901-2345",
      dateRegistered: "2026-02-15",
      amountGranted: 60000,
      remarks: "Catering for 500 pax (3 days)",
    },
    {
      entryId: 3,
      beneficiaryName: "SoundTech AV Rentals",
      location: "Cagayan de Oro City",
      contactNumber: "0926-012-3456",
      dateRegistered: "2026-03-01",
      amountGranted: 45000,
      remarks: "AV equipment and technical support",
    },
    {
      entryId: 4,
      beneficiaryName: "PrintMax Advertising",
      location: "Cagayan de Oro City",
      contactNumber: "0927-123-4567",
      dateRegistered: "2026-03-10",
      amountGranted: 35000,
      remarks: "Tarpaulins, banners, IDs",
    },
    {
      entryId: 5,
      beneficiaryName: "GreenLeaf Decor",
      location: "Cagayan de Oro City",
      contactNumber: "0928-234-5678",
      dateRegistered: "2026-03-20",
      amountGranted: 20000,
      remarks: "Stage and booth decorations",
    },
  ],

  // Project 4: AI Robot Study Buddy
  4: [
    {
      entryId: 1,
      beneficiaryName: "USTP Robotics Lab",
      location: "Cagayan de Oro City",
      contactNumber: "0929-345-6789",
      dateRegistered: "2026-01-20",
      amountGranted: 20000,
      remarks: "Microcontroller boards and sensors",
    },
    {
      entryId: 2,
      beneficiaryName: "MindaBot Solutions",
      location: "Cagayan de Oro City",
      contactNumber: "0930-456-7890",
      dateRegistered: "2026-02-14",
      amountGranted: 15000,
      remarks: "AI software licensing fees",
    },
    {
      entryId: 3,
      beneficiaryName: "3D Print Hub NorMin",
      location: "Cagayan de Oro City",
      contactNumber: "0931-567-8901",
      dateRegistered: "2026-03-05",
      amountGranted: 25000,
      remarks: "3D printed chassis and enclosures",
    },
  ],

  // Project 5: Community Water Purifier Deployment
  5: [
    {
      entryId: 1,
      beneficiaryName: "Brgy. Macasandig Water Assoc.",
      location: "Cagayan de Oro City",
      contactNumber: "0932-678-9012",
      dateRegistered: "2026-01-25",
      amountGranted: 75000,
      remarks: "UV purifier unit installed",
    },
    {
      entryId: 2,
      beneficiaryName: "Brgy. Bulua Community Center",
      location: "Cagayan de Oro City",
      contactNumber: "0933-789-0123",
      dateRegistered: "2026-02-10",
      amountGranted: 75000,
      remarks: "Filtration system deployed",
    },
    {
      entryId: 3,
      beneficiaryName: "Brgy. Iponan Waterworks",
      location: "Cagayan de Oro City",
      contactNumber: "0934-890-1234",
      dateRegistered: "2026-03-15",
      amountGranted: 75000,
      remarks: "Reverse osmosis system — pending inspection",
    },
    {
      entryId: 4,
      beneficiaryName: "Brgy. Kauswagan Health Ctr",
      location: "Cagayan de Oro City",
      contactNumber: "0935-901-2345",
      dateRegistered: "2026-04-20",
      amountGranted: 75000,
      remarks: "Multi-stage filter — installation scheduled",
    },
  ],
};
