const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;
const bodyparser = require('body-parser');
const cors = require('cors');

app.use(bodyparser.json());
app.use(cors());

const initializeData = () => {
    fs.readFile('data.json', (err, data) => {
        let locations = { live: [], inProgress: [], demo: [] };

        if (!err) {
            try {
                locations = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing data file:', parseErr);
            }
        }

        locations.live = locations.live || [];
        locations.inProgress = locations.inProgress || [];
        locations.demo = locations.demo || [];

        const updatedData = JSON.stringify(locations, null, 2);
        fs.writeFile('data.json', updatedData, err => {
            if (err) throw err;
            console.log('Initial data added successfully');
        });
    });
};

initializeData();

app.post('/addLocation', (req, res) => {
    const newLocations = req.body;
    console.log(req.body);

    fs.readFile('data.json', (err, data) => {
        if (err) throw err;

        let locations = {};
        try {
            locations = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing data file:', parseErr);
            return res.status(500).send('Internal Server Error');
        }

        // req.body.forEach(newLocation=>{
        // locations.live = locations.live.filter(x => x.id !== newLocation.id);
        // locations.inProgress = locations.inProgress.filter(x => x.id !== newLocation.id);
        // locations.demo = locations.demo.filter(x => x.id !== newLocation.id);
        // switch (newLocation.type) {
            //     case 'live':
            //         locations.live.push(newLocation);
            //         break;
            //     case 'inProgress':
            //         locations.inProgress.push(newLocation);
            //         break;
            //     case 'demo':
            //         locations.demo.push(newLocation);
            //         break;
            //     default:
            //         return res.status(400).send('Invalid location type');
            //     }
            // })

        newLocations.live.forEach(newLocation => {
            locations.live = locations.live.filter(x => x.id !== newLocation.id);
            locations.inProgress = locations.inProgress.filter(x => x.id !== newLocation.id);
            locations.demo = locations.demo.filter(x => x.id !== newLocation.id);

            locations.live.push(newLocation);
        });

        newLocations.inProgress.forEach(newLocation => {
            locations.live = locations.live.filter(x => x.id !== newLocation.id);
            locations.inProgress = locations.inProgress.filter(x => x.id !== newLocation.id);
            locations.demo = locations.demo.filter(x => x.id !== newLocation.id);

            locations.inProgress.push(newLocation);
        });

        newLocations.demo.forEach(newLocation => {
            locations.live = locations.live.filter(x => x.id !== newLocation.id);
            locations.inProgress = locations.inProgress.filter(x => x.id !== newLocation.id);
            locations.demo = locations.demo.filter(x => x.id !== newLocation.id);

            locations.demo.push(newLocation);
        });

        fs.writeFile('data.json', JSON.stringify(locations, null, 2), (err) => {
            if (err) throw err;
            console.log("UPDATED");
            res.status(200).send('Locations updated successfully');
        });
    });
});

app.get('/getLocation', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            return res.status(500).send('Internal Server Error');
        }
        const locations = JSON.parse(data);
        res.status(200).json(locations);
    });
});

app.post('/deleteLocation' , (req,res) =>{
    const {type , id} = req.body
    // const delLocation = req.body;
    // console.log(req.body)

    fs.readFile('data.json', (err, data) => {
        if (err) throw err;

        let locations = {};
        try {
            locations = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing data file:', parseErr);
            return res.status(500).send('Internal Server Error');
        }

        // if(locations[type] && locations[type][index]){
        //     locations[type].splice(index,1) 
        // }
        // req.body.forEach(delLocation => {
        //     locations.live = locations.live.filter(x => x.id == delLocation.id);
        //     locations.inProgress = locations.inProgress.filter(x => x.id == delLocation.id);
        //     locations.demo = locations.demo.filter(x => x.id == delLocation.id);
        // })

        locations[type] = locations[type].filter(location => location.id !== id);
        
        fs.writeFile('data.json', JSON.stringify(locations, null, 2), (err) => {
            if (err) throw err;
            console.log("Location deleted");
            res.status(200).send('Locations deleted successfully');
        });
    })
})

// app.post('/addPinLocation' , (req , res) => {


//     fs.readFile('data.json', (err, data) => {
//         if (err) throw err;

//         let locations = {};
//         try {
//             locations = JSON.parse(data);
//         } catch (parseErr) {
//             console.error('Error parsing data file:', parseErr);
//             return res.status(500).send('Internal Server Error');
//         }
//     })
// })

app.post('/addPinLocation', (req, res) => {
    const newLocation = req.body;

    fs.readFile('data.json', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            return res.status(500).send('Internal Server Error');
        }

        let locations = {};
        try {
            locations = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing data file:', parseErr);
            return res.status(500).send('Internal Server Error');
        }

        switch (newLocation.type) {
            case 'live':
                locations.live.push(newLocation);
                break;
            case 'inProgress':
                locations.inProgress.push(newLocation);
                break;
            case 'demo':
                locations.demo.push(newLocation);
                break;
            default:
                return res.status(400).send('Invalid location type');
        }

        fs.writeFile('data.json', JSON.stringify(locations, null, 2), (err) => {
            if (err) {
                console.error('Error writing data file:', err);
                return res.status(500).send('Internal Server Error');
            }
            console.log('Location added successfully');
            res.status(200).send('Location added successfully');
        });
    });
});


app.get('/locations', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        if (err) throw err;
        res.status(200).json(JSON.parse(data));
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
