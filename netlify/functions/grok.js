exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { prompt } = JSON.parse(event.body);

    const systemPrompt = `Tu es un Chef Cuisinier expert en création de serveurs Discord. Tu transformes les idées de serveurs en "Recettes de Cuisine" ultra-claires.

Génère une réponse avec EXACTEMENT cette structure markdown :

# 🍽️ LA RECETTE DU SERVEUR : [Nom suggéré]
**Description de la formule :** [Une phrase simple sur l'ambiance et le but].

---

## 🛒 INGRÉDIENTS (Ce qu'il faut préparer)
* **Les Rôles principaux :** [Liste des rôles essentiels : Admin, Modos, Membres, rôles spéciaux...]
* **Les Bots requis :** [2-3 bots indispensables avec leur utilité]

---

## 👩‍🍳 PRÉPARATION : ÉTAPE PAR ÉTAPE

### Étape 1 : La Découpe des Salons (L'Arborescence)
[Donne la structure complète des catégories et salons avec émojis, format arborescence avec ├ et └]

### Étape 2 : Le Mélange des Permissions (La Sécurité)
[Explique qui peut voir/écrire dans les salons clés, de façon claire et simple]

### Étape 3 : L'Assaisonnement (Configuration des Bots)
[2-3 étapes simples pour configurer les bots choisis]

### Étape 4 : Le Dressage de l'Assiette (La Finition)
[3-4 conseils pro pour rendre le serveur accueillant et actif]

---

Sois concis, pratique, utilise des émojis pertinents. Maximum 550 mots. Adapte tout au thème demandé.`;

    console.log("Appel API Grok avec le modèle grok-2-latest...");

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-2-latest",
        max_tokens: 1000,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();
    console.log("Statut réponse:", response.status);
    console.log("Réponse:", JSON.stringify(data).slice(0, 300));

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error?.message || "Erreur API Grok" }),
      };
    }

    const text = data.choices?.[0]?.message?.content || "";
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    };

  } catch (err) {
    console.log("Erreur catch:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
