# LiveTogether
```json
/user
  /signup
    {
        "firstName": "Joaco",
        "lastName": "Fernandez",
        "username": "jFernandez",
        "password": "12345678"
    }
    {
        "user": {
            "idUser": "cmgzqsgc20000fn7kd75sntf2",
            "firstName": "Federico",
            "lastName": "Greco",
            "username": "fGreco"
        }
    }

  /signin
    {
        "username": "jFernandez",
        "password": "12345678"
    }
    {
        "user": {
            "idUser": "cmgznv2yc0000fn4o2bb2mrbg",
            "firstName": "Joaco",
            "lastName": "Fernandez",
            "username": "jFernandez"
        }
    }
    
/family
  /create
    {
        "name": "Fernandez"
    }
    {
        "family": {
            "idFamily": "cmgzqtmdi0000fnak1n25wg65",
            "name": "Fernandez"
        }
    }
    
  /checkfamilies  
    {
        "families": [
            {
                "idFamily": "cmgznzmxl0001fngohw15mwq7",
                "name": "Fernandez",
                "role": "Admin"
            },
            {
                "idFamily": "cmgzo0smf0004fngo9jodpsmw",
                "name": "Tontos",
                "role": "Admin"
            },
            {
                "idFamily": "cmgzqtmdi0000fnak1n25wg65",
                "name": "Fernandez",
                "role": "Admin"
            }
        ]
    }
    
/members/:id
  {
    "members": [
        {
            "idUser": "cmgznv2yc0000fn4o2bb2mrbg",
            "firstName": "Joaco",
            "lastName": "Fernandez",
            "username": "jFernandez"
        },
        {
            "idUser": "cmgznwiop0000fngog2lmncyh",
            "firstName": "Valen",
            "lastName": "Gerakios",
            "username": "vGerakios"
        }
    ]
}

/rankings/:id
  {
    "rankings": [
        {
            "idFamilyUser": "cmgzpabae0005fncgb8m3jw1j",
            "idUser": "cmgznwiop0000fngog2lmncyh",
            "idFamily": "cmgzo0smf0004fngo9jodpsmw",
            "idRole": 1,
            "points": 20,
            "user": {
                "idUser": "cmgznwiop0000fngog2lmncyh",
                "firstName": "Valen",
                "lastName": "Gerakios",
                "username": "vGerakios",
                "password": "$2b$10$rJa..WGzWkNF6IsXvnYRM.VEp5WJx8y0aj4aeREsQwYLdPg.cZkgO"
            }
        },
        {
            "idFamilyUser": "cmgzo0smk0006fngosbaq8398",
            "idUser": "cmgznv2yc0000fn4o2bb2mrbg",
            "idFamily": "cmgzo0smf0004fngo9jodpsmw",
            "idRole": 2,
            "points": 0,
            "user": {
                "idUser": "cmgznv2yc0000fn4o2bb2mrbg",
                "firstName": "Joaco",
                "lastName": "Fernandez",
                "username": "jFernandez",
                "password": "$2b$10$h7XpV61ObP6/7cenhNFupe6iz8Hn5FF8z1ub0j68GRVE.B3P7Ug3i"
            }
        }
    ]
}
```
