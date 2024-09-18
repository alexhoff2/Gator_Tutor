# Credentials Folder

## Purpose
This folder is designed to securely store all credentials required for logging into the server and databases associated with the project. This information is essential for grading purposes and for class TAs or the CTO to assist with technical issues.

## Items Required
Below is a list of items that must be included. Missing or incorrect information may result in points being deducted from milestone submissions.

### 1. Server Information
- **Server URL or IP:** `<your_server_ip_or_url>`
- **SSH Username:** `<your_ssh_username>`
- **SSH Key:** Use the `ssh_key.pem` located in this `credentials` folder.
- **SSH Connection Command:**
    ```bash
    ssh -i credentials/ssh_key.pem <your_ssh_username>@<your_server_ip_or_url>
    ```

### 2. Database Information
- **Database URL/IP:** `localhost` or `<your_database_ip>` (if remote)
- **Database Port:** `3306` (default) or `<your_custom_port>` if different
- **Database Username:** `<your_db_username>`
- **Database Password:** `<your_db_password>`
- **Database Name:** `<your_database_name>`

### 3. Usage Instructions

#### SSH Access:
1. Ensure the current working `ssh_key.pem` is stored in the `credentials/` folder.
2. Use the SSH command listed above to connect to the server.
3. Ensure the private key (`ssh_key.pem`) has the correct permissions by running:
    ```bash
    chmod 400 credentials/ssh_key.pem
    ```

#### MySQL Database Access (via CLI):
1. To access the MySQL database via the command line, use the following command:
    ```bash
    mysql -h <your_database_ip> -P <your_database_port> -u <your_db_username> -p
    ```
2. Enter the database password when prompted.

#### MySQL Workbench Setup:
To connect using MySQL Workbench, create a new connection using the following details:
- **Hostname:** `<your_database_ip>` or `127.0.0.1` (if local)
- **Port:** `3306` (or `<your_custom_port>`)
- **Username:** `<your_db_username>`
- **Password:** `<your_db_password>`
- **Database Name:** `<your_database_name>`

Ensure that the connection is set up with the correct SSH tunneling if we're using a local or remote database.

### Notes:
- Do **not** store sensitive information like SSH private keys in this `README.md` file. Keep it in separate files as needed (e.g., `ssh_key.pem`).
- Update this information regularly throughout the semester to avoid missing credentials during grading or troubleshooting.
