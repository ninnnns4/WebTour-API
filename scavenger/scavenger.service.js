const db = require('_helpers/db');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
    create,
    getAll,
    getById,
    update,
    delete: _delete
};


async function create(scavengerData) {
    const { image, ...scavengerDetails } = scavengerData;

    try {
        const scavenger = await db.Scavenger.create(scavengerDetails);

        if (image) {
            const imagePath = await saveImage(scavenger.id, image);
            console.log('Saved image path:', imagePath); // Add this line

            await scavenger.update({ image: imagePath });
        }

        return basicDetails(scavenger);
    } catch (error) {
        throw error;
    }
}

async function saveImage(scavengerId, imageData) {
    try {
        console.log('Image data:', imageData); // Log imageData for debugging

        // Validate image file extension
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        const extension = path.extname(imageData.originalname);
        if (!allowedExtensions.includes(extension)) {
            throw 'Only JPG, JPEG, PNG, and GIF files are allowed';
        }

        // Define file path
        const relativeImagePath = path.join('uploads', imageData.filename);

        console.log('Image path:', relativeImagePath);

        // Write image data to file
       // await fs.writeFile(imagePath, imageData.buffer);

        // Return the relative path of the image
        return relativeImagePath;
    } catch (error) {
        console.error('Error saving image:', error);
        throw error;
    }
}


async function update(id, scavengerData) {
    const { image, ...scavengerDetails } = scavengerData;

    try {
        // Get the event object from the database
        const scavenger = await getScavenger(id);

        // Update event data
        await scavenger.update(scavengerDetails);

        // If image is provided, update it
        if (image) {
            const imagePath = await saveImage(scavenger.id, image);
            await scavenger.update({ image: imagePath });
        }

        return basicDetails(scavenger);
    } catch (error) {
        throw error;
    }
}



async function getAll() {
    try {
        const scavenger = await db.Scavenger.findAll();
        return scavenger.map(scavenger => basicDetails(scavenger));
    } catch (error) {
        throw error;
    }
}

async function getById(id) {
    try {
        const scavenger = await getScavenger(id);
        return basicDetails(scavenger);
    } catch (error) {
        throw error;
    }
}

async function _delete(id) {
    try {
        const scavenger = await getScavenger(id);
        await scavenger.destroy();
    } catch (error) {
        throw error;
    }
}

async function getScavenger(id) {
    try {
        const scavenger = await db.Scavenger.findByPk(id);
        if (!scavenger) throw 'Scavenger not found';
        return scavenger;
    } catch (error) {
        throw error;
    }
}

function basicDetails(scavenger) {
    const { id, name, image, lugar } = scavenger;
    return { id, name, image, lugar };
}
