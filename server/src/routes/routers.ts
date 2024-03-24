/*
Edit this file to edit which routers are used by the server.
In order to add a router, please 
1) Import it into the file
2) Come up with a prefix for routes which direct to the router. 
The prefix should be of the form '/api/ROUTERNAME'
3) Add an entry with the prefix and imported router to prefixToRouterMap
*/
import { Router } from 'express';
import adminRouter from './admin.route';
import authRouter from './auth.route';
// import donationRouter from './donation.route';
import donorRouter from './donor.route';
import groupRouter from './group.route';
import purposeRouter from './purpose.route';
import communicationRouter from './communication.route';

const prefixToRouterMap: { prefix: string; router: Router }[] = [
  {
    prefix: '/api/auth',
    router: authRouter,
  },
  {
    prefix: '/api/admin',
    router: adminRouter,
  },
  // {
  //   prefix: '/api/donation',
  //   router: donationRouter,
  // },
  {
    prefix: '/api/donor',
    router: donorRouter,
  },
  {
    prefix: '/api/group',
    router: groupRouter,
  },
  {
    prefix: '/api/purpose',
    router: purposeRouter,
  },
  {
    prefix: '/api/communication',
    router: communicationRouter,
  },
];

export default prefixToRouterMap;
