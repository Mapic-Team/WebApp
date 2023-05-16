
class crud{
    async readUser(name){
       try{
           const response = await fetch(`/readUser`, {
               method: 'GET',
               headers: {'Content-Type': 'application/json'},
               userName:name
           });
           const data = await response.json();
           return data;
       }
       catch(err){
           return false;
       }
   }
    async  createUser(name,password){
       try{
           const response = await fetch(`/createUser`, {
               method: 'POST',
               headers: {'Content-Type': 'application/json'},
               userName:name,
               password:password
           });
           const data = await response.json();
           return true;
       }
       catch(err){
           return false;
       }
   }
   
   async deleteUser(name){
       try{
           const response = await fetch(`/createUser`, {
               method: 'DELETE',
               headers: {'Content-Type': 'application/json'},
               userName:name,
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
           const response = await fetch(`/readPicture`, {
               method: 'GET',
               headers: {'Content-Type': 'application/json'},
               picId : picid
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
               userName:name,
               setting:settings
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