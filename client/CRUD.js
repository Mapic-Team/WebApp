
class crud{
    async readUser(name){
        console.log("what");
        const response = await fetch(`/readUser?userName=${name}`, {
               method: 'GET',
               headers: {'Content-Type': 'application/json'},
        });
           const data = await response.json();
           console.log(data);
           return data;
   }
    async createUser(name,password){
        console.log("create");
       try{
           const response = await fetch(`/createUser`, {
               method: 'POST',
               headers: {'Content-Type': 'application/json'},
               body:JSON.stringify({userName:name,password:password})
           });
           const data = await response.json();
           return data;
       }
       catch(err){
           return false;
       }
   }
   
   async deleteUser(name){
       try{
           const response = await fetch(`/createUser?userName=${name}`, {
               method: 'DELETE',
               headers: {'Content-Type': 'application/json'},
           });
           const data = await response.json();
           return true;
       }
       catch(err){
           return false;
       }
   }
   async getPicture(picid){
       try{
           const response = await fetch(`/readPicture?picId=${picid}`, {
               method: 'GET',
               headers: {'Content-Type': 'application/json'},
           });
           const data = await response.json();
           return data;
       }
       catch(err){
           return false;
       }
   }
   
   async createPicture(picture){
    try{
        const response = await fetch(`/createUser`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({picture:picture})
        });
        const data = await response.json();
        return data;
    }
    catch(err){
        return false;
    }
   }

   async deletePicture(picId){
        try{
        const response = await fetch(`/createUser?picId=${picId}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        });
        const data = await response.json();
        return true;
        }
        catch(err){
            return false;
        }
   }

   async getMostLikedPic(user){
       try{
           const response = await fetch(`/getMostLikedPic?userName=${user}`, {
               method: 'GET',
               headers: {'Content-Type': 'application/json'}
           });
           const data = await response.json();
           return data;
       }
       catch(err){
           return false;
       }
   }
   
   async changeSetting(name , settings){
       try{
           const response = await fetch(`/updateSettings`, {
               method: 'POST',
               headers: {'Content-Type': 'application/json'},
               body:JSON.stringify({userName:name,setting:settings})
           });
           const data = await response.json();
           return data;
       }
       catch(err){
           return false;
       }
   }

   async changeProfilePic(name, profilePic){
    try{
        const response = await fetch(`/updateProfilePicture`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({userName:name,profilePic:profilePic})
        });
        const data = await response.json();
        return data;
    }
    catch(err){
        return false;
    } 
   }

   async changeDescription(name, description){
    try{
        const response = await fetch(`/updateDescription`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({userName:name,description: description})
        });
        const data = await response.json();
        return data;
    }
    catch(err){
        return false;
    } 
   }

   async changeLikeBy(picId,change){
    try{
        const response = await fetch(`/changeLikeBy`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({picId:picId,change: change})
        });
        const data = await response.json();
        return data;
    }
    catch(err){
        return false;
    } 
   }
   async addComment(picId, comment){
    try{
        const response = await fetch(`/addComment`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({picId:picId,comment: comment})
        });
        const data = await response.json();
        return data;
    }
    catch(err){
        return false;
    } 
   }

   async getTrending(){
    try{
        const response = await fetch(`/getTrending`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
        const data = await response.json();
        return data;
    }
    catch(err){
        return false;
    } 
   }

   async getTenMostCommonTags(){
    try{
        const response = await fetch(`/getTenMostCommonTags`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
        const data = await response.json();
        return data;
    }
    catch(err){
        return false;
    } 
   }
}
   
   const mapicCrud = new crud()
   export {mapicCrud}