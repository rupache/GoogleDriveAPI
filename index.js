const { google } = require('googleapis');
const fs = require('fs');

async function run() {
    const credentials = require('../GAPI/electric-folio-304521-3a6ad99e9d38.json');

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/drive'],
    });

    // Create a client instance
    const client = await auth.getClient();

    // Obtain the access token
    const accessToken = await client.getAccessToken();

    const drive = google.drive({ version: 'v3', auth: client });

    drive.files.list(
        {
            pageSize: 10,
            fields: 'nextPageToken, files(name, mimeType)',
        },
        (err, res) => {
            if (err) return console.error('The API returned an error:', err.message);

            const files = res.data.files;
            if (files.length) {
                console.log('Files:');
                files.forEach((file) => {
                    console.log(`${file.name} (${file.mimeType})`);
                });
            } else {
                console.log('No files found.');
            }
        }
    );

    drive.files.create()
}

async function createWordFile() {
    const credentials = require('../GAPI/electric-folio-304521-3a6ad99e9d38.json');

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/drive'],
    });

    // Create a client instance
    const client = await auth.getClient();

    const drive = google.drive({ version: 'v3', auth: client });

    // Define the file metadata
    const fileMetadata = {
        name: 'My Word File',
        mimeType: 'application/vnd.google-apps.document',
    };

    // Create the Word file
    const response = await drive.files.create({
        resource: fileMetadata,
        media: {
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            body: fs.createReadStream('word_file.docx'), // Assuming the Word file is in the same directory as the script
        },
    });

    console.log('File created:', response.data);

}

async function listFilesWithLocations() {
    const credentials = require('../GAPI/electric-folio-304521-3a6ad99e9d38.json');

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/drive'],
    });

    // Create a client instance
    const client = await auth.getClient();

    const drive = google.drive({ version: 'v3', auth: client });

    // Retrieve all files
    const response = await drive.files.list({
        pageSize: 100, // Adjust as needed
        fields: 'nextPageToken, files(id, name, parents)',
    });

    const files = response.data.files;

    if (files.length) {
        console.log('Files:');
        files.forEach(async (file) => {
            console.log(`- ${file.name} (${file.id}) (${file.webViewLink})`);
            if (file.parents && file.parents.length) {
                console.log('  - Parent folders:');

                // Share the file with a specific user
                const permissionResponse = await drive.permissions.create({
                    fileId: file.id,
                    requestBody: {
                        role: 'writer',
                        type: 'user',
                        emailAddress: 'ngsrupesh@gmail.com', // Replace with the email address of the user you want to share with
                    },
                    fields: 'id',
                });

                file.parents.forEach((parentId) => {
                    const parent = files.find((f) => f.id === parentId);
                    if (parent) {
                        console.log(`    - ${parent.name} (${parent.id})`);
                    }
                });
            }
        });
    } else {
        console.log('No files found.');
    }
}

async function createFolderAndShare() {
    const credentials = require('../GAPI/electric-folio-304521-3a6ad99e9d38.json');

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const client = await auth.getClient();

    const drive = google.drive({ version: 'v3', auth: client });

    const folderMetadata = {
        name: '8000',
        mimeType: 'application/vnd.google-apps.folder',
        parents: ['1010voEQ8JBzWdTlhysX1EWXQiwhP4Yb5'], // Replace with the ID of the parent folder
    };

    const folderResponse = await drive.files.create({
        resource: folderMetadata,
        fields: 'id',
    });

    const folderId = folderResponse.data.id;

    const permission = {
        type: 'user',
        role: 'writer',
        emailAddress: 'ngsrupesh@gmail.com', // Replace with the email address of the user you want to share with
    };

    await drive.permissions.create({
        fileId: folderId,
        requestBody: permission,
    });

    const folderInfo = await drive.files.get({
        fileId: folderId,
        fields: 'webViewLink',
    });

    const folderLink = folderInfo.data.webViewLink;
    console.log('Folder created and shared successfully!');
    console.log('Folder link:', folderLink);
}

async function removeFileOrFolder() {
    const credentials = require('../GAPI/electric-folio-304521-3a6ad99e9d38.json');

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const client = await auth.getClient();

    const drive = google.drive({ version: 'v3', auth: client });

    const fileId = 'XXXXXXXX'; // Replace with the ID of the file or folder you want to remove
    
    await drive.files.delete({ fileId });

    console.log('File or folder removed successfully!');
}

//removeFileOrFolder().catch(console.error);
//createFolderAndShare().catch(console.error);
//listFilesWithLocations().catch(console.error);
//createWordFile().catch(console.error);
//run().catch(console.error);

