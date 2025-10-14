import { NextResponse } from "next/server"

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyskGoaE7hc7jZtFLV_hru0DbTLL63cayCHRSf7H47X76ydeEeN08mlUjOHYOekC-S7/exec";

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    const { name, phone, locations, message } = formData;

    const dataToSend = {
      name: name,
      phone: phone,
      locations: locations,
      message: message,
    };

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    const responseText = await response.text();
    let result = null;

    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error("======================================================================");
      console.error("[API ERROR] Google Sheet Syntax Error: Failed to parse JSON.");
      console.error("[API ERROR] RAW RESPONSE (HTML ERROR):", responseText); // Changed to show full responseText
      console.error("[API ERROR] Check Apps Script URL, Deployment access (must be 'Anyone'), or an execution failure.");
      console.error("======================================================================");
      throw new Error("Invalid response from Google Sheet API. Check Apps Script URL/Deployment.");
    }

    if (!response.ok || result.status === 'error') {
      console.error("[API] Google Sheet Logic Error:", result?.message || "Unknown error");
      throw new Error(`Failed to log data: ${result?.message || 'Unknown error from Apps Script'}`);
    }

    console.log("[API] RSVP logged to Google Sheet:", result);

    return NextResponse.json({ success: true, logged: true });
  } catch (error) {
    console.error("[API] Error sending RSVP:", error);
    return NextResponse.json({ success: false, error: "Failed to send RSVP or log data" }, { status: 500 });
  }
}
