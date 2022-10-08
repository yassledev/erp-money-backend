import moment from 'moment';
import fetch from 'node-fetch';


export async function call_student_api(type, route){
    try {
        const response = await fetch(`${process.env.STUDENT_API}/${route}`, {
            method: type,
            responseType: "json",
            headers: {
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.e30.57liIDu_0WkNYVluL15dPGT93TYxzckQ7r4VRhi-a9M"
            }
        });
        const data = await response.json()
        if (response.status >= 400 && response.status < 600) {
            throw new Error(`${data.error} : ${data.message}`);
        }
        return data
    } catch (error){
        throw Error(error);
    }
}

export async function add_money_to_student(studentId, amount){
    return await call_student_api('PUT', `api/v1/money/Add/${studentId}/${amount}`);
}

export async function subtract_money_to_student(studentId, amount){
    return await call_student_api('PUT', `api/v1/money/Substract/${studentId}/${amount}`) ;
}

export async function get_student_by_id(studentId){
    let students = await get_all_student();
    const student = students.filter(student => student.id == studentId);
    if (student.length == 0)
        throw Error("No user with this ID")
    return student[0]
}

export async function get_all_student(){
    return await call_student_api('GET', `api/v1/student/GetAll`);
}

export function is_membership(student){
    let isMember = false;
    const today = moment();
    student.memberships.forEach(membership => {
        if(today > moment(membership.start) && moment(membership.end) > today){
            isMember = true;
        }
    });
    return isMember;
}