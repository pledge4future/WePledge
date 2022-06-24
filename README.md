# Pledge4Future App

Pledge4Future is a project to help you and your working group to measure and reduce your work-related CO2e-footprint. It helps you and everyone else to contribute protecting our climate and life on Earth.

The [pledge4future app](https://pledge4future.org) allows you to calculate your work related CO<sub>2</sub>e emissions from heating and electricity consumptions as well as business trips and commuting. The methodology for the calculation the emissions is implemented in the [co2calculator package](https://github.com/pledge4future/co2calculator). 

## Getting Started

The app is run using Docker, uses React in the frontend and Python, Django and GraphQL in the backend.

### Installation

Clone the repository and run docker.

```
docker compose up  
```

This will start the following services:

Frontend: [http://localhost:3000](localhost:3000)  
Backend: [http://localhost:8000](localhost:8000)  
Django Admin: [http://localhost:8000/admin](localhost:8000/admin)  
GraphQL API: [http://localhost:8000/graphql](localhost:8000/graphql)  

Refer to the [wiki](https://github.com/pledge4future/WePledge/wiki) for detailed instructions on how to run, adapt and debug the app.

## License

This project is licensed under the [NAME HERE] License - see the LICENSE.md file for details

## Acknowledgments

Big thanks to our supporters!

- Scientists4Future Heidelberg
- Goethe Institute
- HeiGIT (Heidelberg Institute for Geoinformation Technology) gGmbH
- Institute of Geography at Heidelberg University
- Max Planck Institute for Astronomy Heidelberg
