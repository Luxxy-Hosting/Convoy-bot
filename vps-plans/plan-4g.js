
module.exports = (userID, ServerName, Password, freeipaddress) => {
    function getHostname (ServerName) {
        return ServerName.toLowerCase().replace(/ /g, "-")
    } 
    return {
        "node_id": 3,
        "user_id": userID,
        "name": ServerName,
        "hostname": getHostname(ServerName),
        "vmid": null,
        "limits": {
            "cpu": 4,
            "memory": 4294967296,
            "disk": 26843545600,
            "snapshots": 0,
            "backups": null,
            "bandwidth": null,
            "address_ids": [ freeipaddress ],
        },
        "account_password": `${Password}`,
        "should_create_server": true,
        "template_uuid": "2b5f4cb0-8d0d-448c-b696-e9d8cebdf178",
        "start_on_completion": true,
    }
}