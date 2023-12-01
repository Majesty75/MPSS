<a name="readme-top"></a>


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Majesty75/MPSS">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">MPSS - Motor Parts Shop Software</h3>

  <p align="center">
    Software for spare parts inventory management
    <br />
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![Dashboard Screen Shot][dashboard-screenshot]

This project was made as part of academic assignment for below problem.

A small automobile spare parts shop sells the spare parts for a vehicles of several makes and models. Also,
each spare part is typically manufactured by several small industries. To stream line the sales and supply
ordering, the shop owner has asked us to develop the following motor part shop software.
Motor Part Shop Software (MPSS). The motor parts shop deals with large number of motor parts of
various manufacturers and various vehicle types. Some of the motor parts are very small and some are of
reasonably large size. The shop owner maintains different parts in wall mounted and numbered racks.
The shop owner maintains as few inventory for each item as reasonable, to reduce inventory overheads after
being inspired by the just-in-time (JIT) philosophy.

Thus, one important problem the shop owner faces is to be able to order items as soon as the number of
items in the inventory reduces below a threshold value. The shop owner wants to maintain parts to be able
to sustain selling for about one week. To calculate the threshold value for each item, the software must be
able to calculate the average number of parts sales for one week for each part.

At the end of each day, the shop owner would request the computer to generate the items to be ordered. The
computer should print out the part number, the amount required and the address of the vendor supplying
the part.

The computer should also generate the revenue for each day and at the end of the month, the computer
should generate a graph showing the sales for each day of the month.

The functionalitis of the project include below:
* Login
* Add and update vendors
* Add and Update parts
* Add and update sales
* Add and update purchases
* Daily purchase order report
* Dashboard with multiple stastitics and sales graph

Other features:
* Minimal eye pleasing UI design
* Made with best industry practices currently availale
* Using best production ready boiler plate for faster development
* Uses clean architecture with CQRS design pattern for better scaling performance

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

* [![Angular 16][Angular.io]][Angular-url]
* [![Tailwind CSS][Tailwind]][Tailwind-url]
* [![.NET 8][.NET]][.NET-url]
* [![SQLServer 2022][SQLServer]][SQLServer-url]
* [![Visual Studio 2022][VS]][VS-url]
* [![Visual Studio Code][VSCode]][VSCode-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This project was made with .NET 8, Angular 16 and SQL Server 2022.


### Prerequisites

* Node v18.17.2
  download from <a href="https://nodejs.org/en/about/previous-releases"></a>

* .NET 8.0.100 SDK
  download from <a href="https://dotnet.microsoft.com/en-us/download/dotnet/8.0"></a>

* SQL Server 2022 or SQL Server 2022 Express
  download from <a href="https://www.microsoft.com/en-in/sql-server/sql-server-downloads"></a>

* Visual Studio 2022
  download from <a href="https://visualstudio.microsoft.com/"></a>



### Installation

1. Open _backend/MPSSApi.sln_ in Visual Studio.
2. Set _src/Web_  as startup project.
3. Rebuild solution.
4. Change connection string in _src/Web/appSettings.json_ to point to your sql server instance and database.
  ```sh
  Server=(Server Name);Database=(Database Name);Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True
  ```
5. Open visual studio developer command prompt and run below commands to generate database
  ```
  dotnet tool update --global dotnet-ef
  dotnet ef database update --project src\Infrastructure --startup-project src\Web
  ```
6. Debug or run the project from visual studio and note localhost url
7. Open _frontend/src/environments/environment.dev.ts and replace hostName with url noted in previous step
8. Open cmd in _frontend_ and run below commands to start frontend
  ```
  npm install
  npm start
  ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Yash Goyani - [@yash-goyani](https://www.linkedin.com/in/yash-goyani-5156601b4/) - goyaniyash75@gmail.com

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Special thanks to providers of below resources.

* [Clean architecture .NET boilerplate by Jason Taylor](https://github.com/jasontaylordev/CleanArchitecture)
* [Readme template by Othneil Drew](https://github.com/othneildrew/Best-README-Template)
* [Adobe Logo generator](https://www.adobe.com/express/create/logo)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[dashboard-screenshot]: images/dashboard.png
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Tailwind]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[.NET]: https://img.shields.io/badge/.NET-5C2D91?style=for-the-badge&logo=.net&logoColor=white
[.NET-url]: https://dotnet.microsoft.com/
[SQLServer]: https://img.shields.io/badge/Microsoft_SQL_Server-CC2927?style=for-the-badge&logo=microsoft-sql-server&logoColor=white
[SQLServer-url]: https://www.microsoft.com/en-in/sql-server/sql-server-downloads
[VS]: https://img.shields.io/badge/Visual_Studio-5C2D91?style=for-the-badge&logo=visual%20studio&logoColor=white
[VS-url]: https://visualstudio.microsoft.com/
[VSCode]: https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white
[VSCode-url]: https://code.visualstudio.com/