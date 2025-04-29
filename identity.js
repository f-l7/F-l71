async function sendToDiscord(data) {
    const webhookURL = 'YOUR_DISCORD_WEBHOOK_URL';
    
    const payload = {
        content: `طلب هوية جديد:\nالاسم: ${data.name}\nالعمر: ${data.age}\nالبلد: ${data.country}\nتاريخ الميلاد: ${data.birthdate}`,
        embeds: [{
            title: "تفاصيل الهوية",
            color: 0x00ff00,
            fields: [
                { name: "الاسم", value: data.name },
                { name: "العمر", value: data.age },
                { name: "البلد", value: data.country },
                { name: "تاريخ الميلاد", value: data.birthdate }
            ]
        }]
    };
    
    try {
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
            console.error('Error sending to Discord');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
