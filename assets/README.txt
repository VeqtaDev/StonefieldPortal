Instructions rapides
--------------------

1) Véhicules
   - Placez les aperçus dans images/vehicules/ avec le même nom que dans assets/vehicules.txt (ex: BUFFALO.png)
   - Vous pouvez remplacer assets/vehicules.txt par votre fichier réel si vous servez le site via un serveur (http)

2) Armes
   - Déposez les images dans images/weapons/
   - Alimentez images/weapons/manifest.json au format:
     [ { "name": "AK-47", "spawn": "weapon_ak47", "img": "ak47.png" }, ... ]

3) Photos
   - Déposez vos captures dans images/photos/
   - Listez-les dans images/photos/manifest.json, ex: ["event1.jpg", "mission2.png"]

4) Vêtements
   - Déposez vos images dans images/clothes/
   - Manifeste: images/clothes/manifest.json
     Formats acceptés:
     - Liste simple de fichiers: ["hoodie_black.png", ...]
     - Objets: [{"name":"Hoodie Noir","code":"hoodie_black","img":"hoodie_black.png"}]


