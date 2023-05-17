
class CRUD{
    constructor(server_url) {
        this.server_url = server_url;
    }

    /************************************ user CRD Functions ******************************************/
    async createUser(name,password){
        try{
            const response = await fetch(`${this.server_url}/createUser`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify({userName:name,password:password})
            });
            const data = await response.json();
            return data;
        } catch(err){
            console.log(err);
            return false;
        }
    }

    async readUser(name){
        try {
            const response = await fetch(`${this.server_url}/readUser?userName=${name}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            });
            const data = await response.json();
            console.log(data);
            return data;
        } catch(err) {
            console.log(err);
            return false;
        }
    }
    
    async deleteUser(name){
        try{
            const response = await fetch(`${this.server_url}/createUser?userName=${name}`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
            });
            const data = await response.json();
            return true;
        }
        catch(err){
            console.log(err);
            return false;
        }
    }

    /************************************ picture CRD Functions ******************************************/

    async createPicture(picture){
        try{
            const response = await fetch(`${this.server_url}/createUser`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify({picture:picture})
            });
            const data = await response.json();
            return data;
        }
        catch(err){
            console.log(err);
            return false;
        }
    }

    async readPicture(picid){
        try{
            const response = await fetch(`${this.server_url}/readPicture?picId=${picid}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            });
            const data = await response.json();
            return data;
        }
        catch(err){
            console.log(err);
            return false;
        }
    }

    async deletePicture(picId){
        try{
        const response = await fetch(`${this.server_url}/createUser?picId=${picId}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        });
        const data = await response.json();
        return true;
        }
        catch(err){
            console.log(err);
            return false;
        }
    }
    
    /************************************ Query Functions ******************************************/

    async getMostLikedPic(user){
        try{
            const response = await fetch(`${this.server_url}/getMostLikedPic?userName=${user}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            });
            const data = await response.json();
            return data;
        }
        catch(err){
            console.log(err);
            return false;
        }
    }

    async getTrending(){
        try{
            const response = await fetch(`${this.server_url}/getTrending`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            });
            const data = await response.json();
            return data;
        }
        catch(err){
            console.log(err);
            return false;
        } 
    }
    
    async getTenMostCommonTags(){
        try{
            const response = await fetch(`${this.server_url}/getTenMostCommonTags`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            });
            const data = await response.json();
            return data;
        }
        catch(err){
            console.log(err);
            return false;
        } 
    }
   
    /************************************ Update Functions ******************************************/

    async changeSetting(name , settings){
        try{
            const response = await fetch(`${this.server_url}/updateSettings`, {
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
            const response = await fetch(`${this.server_url}/updateProfilePicture`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify({userName:name,profilePic:profilePic})
            });
            const data = await response.json();
            return data;
        }
        catch(err){
            console.log(err);
            return false;
        } 
    }

    async changeDescription(name, description){
        try{
            const response = await fetch(`${this.server_url}/updateDescription`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify({userName:name,description: description})
            });
            const data = await response.json();
            return data;
        }
        catch(err){
            console.log(err);
            return false;
        } 
    }

    async changeLikeBy(picId,change){
        try{
            const response = await fetch(`${this.server_url}/changeLikeBy`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify({picId:picId,change: change})
            });
            const data = await response.json();
            return data;
        }
        catch(err){
            console.log(err);
            return false;
        } 
    }
    async addComment(picId, comment){
        try{
            const response = await fetch(`${this.server_url}/addComment`, {
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
}
   
const mapicCrud = new CRUD("http://localhost:3000");
export {mapicCrud};