const buildUserAgent = () => {
    const explicit = process.env.GEOCODER_USER_AGENT;
    if (explicit && explicit.trim()) return explicit.trim();

    const email = process.env.GEOCODER_EMAIL;
    if (email && email.trim()) return `Wanderlust (learning project; ${email.trim()})`;

    return "Wanderlust (learning project)";
};

const geocodeLocation = async (query) => {
    if (!query || !query.trim()) return null;
    if (typeof fetch !== "function") return null;

    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;

    try {
        const res = await fetch(url, {
            headers: {
                Accept: "application/json",
                "User-Agent": buildUserAgent(),
            },
        });

        if (!res.ok) return null;

        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) return null;

        const lat = Number(data[0].lat);
        const lng = Number(data[0].lon);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

        return { lat, lng };
    } catch (e) {
        return null;
    }
};

module.exports = { geocodeLocation };
