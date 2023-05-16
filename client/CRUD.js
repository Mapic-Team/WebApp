
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
           const response = await fetch(`/createUser?userName${name}`, {
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
           const response = await fetch(`/readPicture?picId= ${picid}`, {
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
   
   async getBestPic(){
       try{
           const response = await fetch(`/getMostLikedPic`, {
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
           return true;
       }
       catch(err){
           return false;
       }
   }

   async changeProfilePic(name, profilePic){
    try{
        const response = await fetch(`/updateSettings`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({userName:name,profilePicture: profilePic})
        });
        const data = await response.json();
        return true;
    }
    catch(err){
        return false;
    } 
   }

   }
   
   const mapicCrud = new crud()
   export {mapicCrud}