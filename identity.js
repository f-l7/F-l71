document.getElementById('identityForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const inputs = document.querySelectorAll('input');
  const data = Array.from(inputs).map(input => input.value);

  const webhookUrl = 'https://discord.com/api/webhooks/1366369025986265179/rVX34EBkGn6anyrTz_IMJgBG1Acjr43_raqun2XVkTtpkSeFmygPcYwuL1aebfaQGJp4';

  const payload = {
    embeds: [
      {
        title: "هوية جديدة",
        color: 11599878,
        fields: [
          { name: "الاسم الثلاثي", value: data[0], inline: false },
          { name: "العمر", value: data[1], inline: false },
          { name: "الجنسية", value: data[2], inline: false },
          { name: "تاريخ الميلاد (بالرول)", value: data[3], inline: false },
        ],
        thumbnail: {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Emblem_of_Saudi_Arabia.svg/1024px-Emblem_of_Saudi_Arabia.svg.png"
        }
      }
    ]
  };

  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(() => {
    alert('تم إرسال الهوية بنجاح');
    window.location.href = "index.html";
  });
});