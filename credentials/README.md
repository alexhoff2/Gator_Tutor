# Credentials Folder

## Purpose
This folder is designed to securely store all credentials required for logging into the server and databases associated with the project. This information is essential for grading purposes and for class TAs or the CTO to assist with technical issues.

## Items Required
Below is a list of items that must be included. Missing or incorrect information may result in points being deducted from milestone submissions.

### 1. Server Information
- **Server URL or IP:** `https://gatortutor.net/`
- **SSH Username:** `ec2-user`
- **SSH Key:** Use the `gator-tutor-key.pem` located in this `credentials` folder.
- **SSH Connection Command:**
    ```bash
    ssh -i credentials/gator-tutor-key.pem ec2-user@54.67.51.13
    ```

### 2. Database Information
- **Database URL/IP:** `localhost` or `54.67.51.13` (if remote)
- **Database Port:** `3306` (default)
- **Database Username:** `gator_user`
- **Database Password:** `gator_pass` root password: mysql
- **Database Name:** `gator_tutor`

### 3. Usage Instructions

#### SSH Access:
1. Ensure the current working `gator-tutor-key.pem` is stored in the `credentials/` folder.
2. Use the SSH command listed above to connect to the server.
3. Ensure the private key (`gator-tutor-key.pem`) has the correct permissions by running:
    ```bash
    chmod 400 credentials/gator-tutor-key.pem
    ```

#### MySQL Database Access (via CLI):
1. To access the MySQL database via the command line, use the following command:
    ```bash
    mysql -h 54.67.51.13 -P 3306 -u gator_user -p
    ```
2. Enter the database password when prompted.

#### MySQL Workbench Setup:
To connect using MySQL Workbench, create a new connection using the following details:
- **Hostname:** `54.67.51.13` or `127.0.0.1` (if local)
- **Port:** `3306`
- **Username:** `gator_user`
- **Password:** `mysql`
- **Database Name:** `gator_tutor`

Ensure that the connection is set up with the correct SSH tunneling if we're using a local or remote database.

### Notes:
- Do **not** store sensitive information like SSH private keys in this `README.md` file. Keep it in separate files as needed (e.g., `gator-tutor-key.pem`).
- Update this information regularly throughout the semester to avoid missing credentials during grading or troubleshooting.
