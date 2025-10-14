// Code.gs

const SHEET_NAME = "Data"; 

/**
 * Creates a standardized JSON response for the client.
 * @param {Object} data The data object to be returned as JSON.
 * @returns {GoogleAppsScript.Content.TextOutput} The TextOutput object with JSON content.
 */
function createJsonResponse(data) {
  // Set the response content type to JSON
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Note: Apps Script does not support setting custom HTTP headers like CORS
  return output;
}

/**
 * Handles POST requests to the web app (RSVP submission).
 * @param {GoogleAppsScript.Events.DoPost} e The event object containing request parameters and content.
 * @returns {GoogleAppsScript.Content.TextOutput} The JSON response.
 */
function doPost(e) {
  // Handle preflight OPTIONS request for CORS compliance
  if (!e.postData) {
    return createJsonResponse({ status: 'success', message: 'CORS preflight OK' });
  }
  
  let data;
  
  // Attempt to parse the incoming request body
  try {
    data = JSON.parse(e.postData.contents);
  } catch (error) {
    // Log and return an error if JSON parsing fails (invalid request body)
    Logger.log("JSON Parse Error: " + error.toString());
    return createJsonResponse({ 
      status: 'error', 
      message: 'Invalid JSON format in request body' 
    });
  }
  
  // Attempt to log the data to the Google Sheet
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    // Check if the sheet exists
    if (!sheet) {
      throw new Error("Sheet named " + SHEET_NAME + " not found");
    }

    // Logic to map locations to sheet columns
    const locations = data.locations || [];
    const nhaGai = locations.includes('nha-gai') ? 'X' : '';
    const nhaTrai = locations.includes('nha-trai') ? 'X' : '';
    const daNang = locations.includes('da-nang') ? 'X' : '';
    
    // Data row to append
    const rowData = [
      new Date(), // Timestamp
      data.name || '', // Name
      data.phone || '', // Phone
      nhaGai,     // Nha Gai column
      nhaTrai,    // Nha Trai column
      daNang,     // Da Nang column
      data.message || '' // Message
    ];
    
    // Append the row to the sheet
    sheet.appendRow(rowData);
    
    // Return success response after data is logged
    return createJsonResponse({ status: 'success', message: 'RSVP data logged successfully' });

  } catch (error) {
    // Log and return an error if data logging or sheet access fails
    const errorMessage = error.toString();
    Logger.log("Data Logging Error: " + errorMessage);
    
    // Always return a JSON response, even on failure, to prevent HTML error pages
    return createJsonResponse({ 
      status: 'error', 
      message: 'Server failed to log data', 
      details: errorMessage 
    });
  }
}