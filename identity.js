const webhookURL = 'https://discord.com/api/webhooks/1366369025986265179/rVX34EBkGn6anyrTz_IMJgBG1Acjr43_raqun2XVkTtpkSeFmygPcYwuL1aebfaQGJp4'; // رابط ويبهوك ديسكورد

document.getElementById('identityForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullname = e.target.fullname.value;
    const age = e.target.age.value;
    const nationality = e.target.nationality.value;
    const birthdate = e.target.birthdate.value;

    const payload = {
        embeds: [{
            title: "طلب هوية جديدة 📄",
            color: 3447003,
            fields: [
                { name: "الاسم الثلاثي", value: fullname, inline: true },
                { name: "العمر", value: age, inline: true },
                { name: "الجنسية", value: nationality, inline: true },
                { name: "تاريخ الميلاد", value: birthdate, inline: true }
            ]
        }],
        components: [{
            type: 1,
            components: [
                {
                    type: 2,
                    label: "قبول ✅",
                    style: 3,
                    custom_id: "accept_identity"
                },
                {
                    type: 2,
                    label: "رفض ❌",
                    style: 4,
                    custom_id: "reject_identity"
                }
            ]
        }]
    };

    await fetch(webhookURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    alert("تم إرسال الهوية بنجاح ✅");
});
