
export default {
    'GET /mock/permission': {
        users: [1, 2, 3]
    },
    'GET /mock/authorize/me':
        { "result": { "user": { "id": "admin", "username": "admin", "name": "超级管理员", "type": "user" }, "permissions": [], "dimensions": [], "attributes": {} }, "status": 200, "code": "success" },
    'POST /mock/authorize/login':
        { "result": { "expires": 1800000, "permissions": [], "roles": [], "userId": "admin", "user": { "id": "admin", "username": "admin", "name": "超级管理员", "type": "user" }, "currentAuthority": [], "token": "695654b75a27f34d7273218336255579" }, "status": 200, "code": "success" }
}