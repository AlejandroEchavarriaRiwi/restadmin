# REST Admin

REST Admin is a modern and comprehensive web application for integrated restaurant management. Designed to optimize daily operations, from table and order management to sales analysis and statistics.

## Website

Visit our production application: [www.restadmin.co](https://www.restadmin.co)

## Repository

The source code is available on GitHub: [https://github.com/AlejandroEchavarriaRiwi/restadmin.git](https://github.com/AlejandroEchavarriaRiwi/restadmin.git)

## Key Features

- Table and order management
- Quick order system for staff
- Kitchen dashboard
- Menu and product management
- Sales analysis and statistics
- Customer management and delivery orders
- Interactive dashboard

## Technologies Used

### Frontend
- Next.js 13+
- React 18+
- TypeScript
- Styled Components
- Tailwind CSS
- Lucide React (icons)
- React Icons

### Backend
- .NET (deployed on Azure)

### APIs and Integration
- RESTful API

### Data Visualization
- Recharts

### Global State and Context
- React Context API (NotificationContext)

### Authentication and Authorization
- User role management

### Deployment
- Frontend: Vercel
- Backend: Azure

## Project Structure

The project is organized into different modules, each corresponding to a specific restaurant functionality:

- `Dashboard`: Main control panel view
- `Tables`: Restaurant table and order management
- `KitchenDashboard`: Control panel for the kitchen
- `Menu`: Menu product and category management
- `MenuOrder`: Quick order system for staff
- `Sales`: Sales visualization and analysis
- `Statistics`: Performance graphs and metrics

## Main Components

- `NavBarAsideDashboard`: Side navigation bar
- `TableCard`: Component for displaying table information
- `ProductCard`: Component for displaying menu products
- `NotificationWrapper`: Real-time notification system

## Installation and Setup for Local Development

1. Clone the repository
   ```
   git clone https://github.com/AlejandroEchavarriaRiwi/restadmin.git
   cd restadmin
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Configure environment variables
   Create a `.env.local` file in the project root and add the following variables:
   ```
   For more information contact with us www.restadmin.co
   ```

4. Start the development server
   ```
   npm run dev
   ```

## Usage

Access the production application at [www.restadmin.co](https://www.restadmin.co). For local development, use `http://localhost:3000`. Use the provided credentials to log in and access different functionalities based on the user's role.

## Development

To contribute to the project:

1. Fork the repository on GitHub
2. Clone your fork: `git clone https://github.com/your-username/restadmin.git`
3. Create a new branch for your feature: `git checkout -b feature/new-feature`
4. Make your changes and commit: `git commit -am 'Add new feature'`
5. Push your changes: `git push origin feature/new-feature`
6. Create a Pull Request on GitHub for review

## Deployment

- Frontend: The project is deployed on Vercel and updates automatically with each push to the main branch.
- Backend: The API is hosted on Azure and managed separately.

## License and Copyright

© 2024 RIWI. All rights reserved.

This software and its source code are protected by copyright laws and international treaties.

Non-Commercial Use: This software is intended for non-commercial use only. Any use, reproduction, or distribution of the software without express written authorization from RIWI is strictly prohibited.

Prohibition of Commercial Use: The use of this software for commercial purposes without a specific license agreement with RIWI is explicitly prohibited.

For additional permissions or license inquiries, please contact RIWI at www.restadmin.co.

## Contribution

While we appreciate interest in contributing to the project, due to the proprietary nature of the software, all contributions must be reviewed and approved by RIWI. By submitting a contribution, you agree that RIWI will have the right to use and modify your contribution, and that you will not acquire any ownership rights to the software.

## Contact

For more information, support, or license inquiries, please contact the RIWI development team at www.restadmin.co.
