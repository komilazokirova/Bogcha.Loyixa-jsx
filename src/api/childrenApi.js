
// src/api/childrenApi.js

// Hozircha backend bo'lmagani uchun
// mock (sun'iy) API bilan ishlaymiz.

export async function addChildRequest(childData) {
    // Server javobini simulyatsiya qilish
    await new Promise((resolve) => {
        setTimeout(resolve, 800);
    });

    // Agar serverdan kelgan ma'lumotni
    // simulyatsiya qilmoqchi bo'lsak:
    return {
        id: Date.now(),
        paymentStatus: "qarzdor",
        ...childData,
    };
}

