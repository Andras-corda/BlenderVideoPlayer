Comment ajouter une vidéo à la base de donnée (BDD ou DB)

# Etape 1 prendre un lien de la vidéo youtube
exemple : https://youtu.be/WbJCVBrKoJo?si=OtYRS0bZnMaAdkpw

# Etape 2 renseigner les champs dans le fichier Json

{
    "id": "", => ID de la vidéo ici c'est : WbJCVBrKoJo
    "title": "", => Titre que tu définis toi même
    "description": "", => Description que tu définis toi même
    "thumbnail": "" => Miniature de la video ici c'est : https://img.youtube.com/vi/WbJCVBrKoJo/mqdefault.jpg
}

Le thumbnail c'est https://img.youtube.com/vi/ + ID + /mqdefault.jpg

Détecter L'id :

Plusieurs formats de liens existent
https://www.youtube.com/watch?v=TiK1LkE1UDk
                                  ^^^^^^^^^^^
                                  C'est l'ID 
        
https://youtu.be/TiK1LkE1UDk?si=dBUnn7N3xkWq2iHF
                 ^^^^^^^^^^^
                 C'est l'ID 

https://www.youtube.com/embed/TiK1LkE1UDk
                              ^^^^^^^^^^^
                              C'est l'ID 

# Template vide

{
    "id": "",
    "title": "",
    "description": "",
    "thumbnail": "https://img.youtube.com/vi/ /mqdefault.jpg"
}

Ne pas oublier que en Json il faut ajouter une virgule entre chaque éléments...