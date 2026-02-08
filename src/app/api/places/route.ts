import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  if (query.length < 2) {
    return NextResponse.json([]);
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    // Fallback: return common Indian cities matching the query
    const FALLBACK_CITIES = [
      "Mumbai, Maharashtra",
      "Delhi, NCT",
      "Bangalore, Karnataka",
      "Hyderabad, Telangana",
      "Ahmedabad, Gujarat",
      "Chennai, Tamil Nadu",
      "Kolkata, West Bengal",
      "Pune, Maharashtra",
      "Jaipur, Rajasthan",
      "Lucknow, Uttar Pradesh",
      "Kanpur, Uttar Pradesh",
      "Nagpur, Maharashtra",
      "Indore, Madhya Pradesh",
      "Thane, Maharashtra",
      "Bhopal, Madhya Pradesh",
      "Visakhapatnam, Andhra Pradesh",
      "Coimbatore, Tamil Nadu",
      "Kochi, Kerala",
      "Patna, Bihar",
      "Vadodara, Gujarat",
      "Gurgaon, Haryana",
      "Noida, Uttar Pradesh",
      "Chandigarh, Punjab",
      "Mysore, Karnataka",
      "Mangalore, Karnataka",
      "Hubli, Karnataka",
      "Belgaum, Karnataka",
      "Thiruvananthapuram, Kerala",
      "Madurai, Tamil Nadu",
      "Surat, Gujarat",
      "Rajkot, Gujarat",
      "Bhubaneswar, Odisha",
      "Dehradun, Uttarakhand",
      "Ranchi, Jharkhand",
      "Guwahati, Assam",
      "Amritsar, Punjab",
      "Nashik, Maharashtra",
      "Aurangabad, Maharashtra",
      "Jodhpur, Rajasthan",
      "Raipur, Chhattisgarh",
      "Vijayawada, Andhra Pradesh",
      "Salem, Tamil Nadu",
      "Warangal, Telangana",
      "Tiruchirappalli, Tamil Nadu",
      "Jabalpur, Madhya Pradesh",
      "Agra, Uttar Pradesh",
      "Varanasi, Uttar Pradesh",
      "Allahabad, Uttar Pradesh",
      "Meerut, Uttar Pradesh",
      "Faridabad, Haryana",
      // Tamil Nadu — extended
      "Tirunelveli, Tamil Nadu",
      "Vellore, Tamil Nadu",
      "Tiruppur, Tamil Nadu",
      "Erode, Tamil Nadu",
      "Thoothukudi, Tamil Nadu",
      "Dindigul, Tamil Nadu",
      "Thanjavur, Tamil Nadu",
      "Nagercoil, Tamil Nadu",
      "Hosur, Tamil Nadu",
      "Avadi, Tamil Nadu",
      "Kumbakonam, Tamil Nadu",
      "Cuddalore, Tamil Nadu",
      "Kancheepuram, Tamil Nadu",
      "Karur, Tamil Nadu",
      "Sivakasi, Tamil Nadu",
      "Tambaram, Tamil Nadu",
      "Karaikudi, Tamil Nadu",
      "Namakkal, Tamil Nadu",
      "Pudukkottai, Tamil Nadu",
      "Tiruvannamalai, Tamil Nadu",
      "Tiruvallur, Tamil Nadu",
      "Tiruttani, Tamil Nadu",
      "Ponneri, Tamil Nadu",
      "Naravarikuppam, Tamil Nadu",
      "Veppampattu, Tamil Nadu",
      "Chengalpattu, Tamil Nadu",
      "Maduranthakam, Tamil Nadu",
      "Mamallapuram, Tamil Nadu",
      "Maraimalai Nagar, Tamil Nadu",
      "Nandivaram-Guduvancheri, Tamil Nadu",
      "Kundrathur, Tamil Nadu",
      "Mangadu, Tamil Nadu",
      "Sriperumbudur, Tamil Nadu",
      "Chidambaram, Tamil Nadu",
      "Panruti, Tamil Nadu",
      "Nellikuppam, Tamil Nadu",
      "Tittakudi, Tamil Nadu",
      "Vadalur, Tamil Nadu",
      "Virudhachalam, Tamil Nadu",
      "Kottakuppam, Tamil Nadu",
      "Tindivanam, Tamil Nadu",
      "Viluppuram, Tamil Nadu",
      "Kallakurichi, Tamil Nadu",
      "Tirukoilur, Tamil Nadu",
      "Ulundurpettai, Tamil Nadu",
    ];
    const q = query.toLowerCase();
    const results = FALLBACK_CITIES.filter((c) => c.toLowerCase().includes(q)).slice(0, 6);
    return NextResponse.json(results);
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      query
    )}&types=(cities)&components=country:in&key=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.status === "OK" && data.predictions) {
      const suggestions = data.predictions
        .map((p: { description: string }) => p.description)
        .slice(0, 6);
      return NextResponse.json(suggestions);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error("Places API error:", error);
    return NextResponse.json([]);
  }
}
