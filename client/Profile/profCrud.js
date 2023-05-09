
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

export async function update_profile(nam,pass,newdes){
    const response = await fetch(`/users/create?old_name=${nam}&new_name=${nam}&new_password=${pass}&new_profileDescription${newdes}`, {
        method: 'PUT'
    });
    const data = await response.json();
    return data;
}