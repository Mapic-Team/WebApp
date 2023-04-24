export async function update_profile(name,password,description){

}
export async function check_profile(name){
    try{
        const response = await fetch(`/users/get?name=${name}`, {
            method: 'GET'
        });
        const data = await response.json();
        return true;
    }
    catch(err){
        return false;
    }
}
export async function createProf(name,password){
    try{
        const response = await fetch(`/users/create?name=${name}&password=${password}`, {
            method: 'GET'
        });
        const data = await response.json();
        return true;
    }
    catch(err){
        return false;
    }
}

export async function update_profile(old,newNam,newpass,newdes){
    const response = await fetch(`/users/create?old_name=${old}&new_name=${newNam}&new_password=${newpass}&new_profileDescription${newdes}`, {
        method: 'PUT'
    });
    const data = await response.json();
    return data;
}