const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("GEMINI_API_KEY not found in environment.");
    process.exit(1);
}

const modelsToTest = [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-2.0-flash-exp',
    'gemini-pro'
];

async function testModel(modelName) {
    console.log(`\nTesting model: ${modelName}...`);
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
            {
                contents: [{ role: "user", parts: [{ text: "Hello, world!" }] }]
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );
        console.log(`✅ SUCCESS: ${modelName}`);
        return true;
    } catch (error) {
        console.log(`❌ FAILED: ${modelName}`);
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            // console.log(`   Data: ${JSON.stringify(error.response.data)}`);
            if (error.response.data && error.response.data.error) {
                console.log(`   Error: ${error.response.data.error.message}`);
            }
        } else {
            console.log(`   Error: ${error.message}`);
        }
        return false;
    }
}

async function runTests() {
    console.log("Starting model connectivity tests...");
    let success = false;
    for (const model of modelsToTest) {
        if (await testModel(model)) {
            success = true;
            console.log(`\nRecommended Model: ${model}`);
            break; // Stop after finding the first working one
        }
    }

    if (!success) {
        console.log("\nNo working models found. Listing available models...");
        try {
            const response = await axios.get(
                `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
            );
            const models = response.data.models;
            models.forEach(m => console.log(`- ${m.name}`));
        } catch (e) {
            console.error("Failed to list models:", e.message);
        }
    }
}

runTests();
