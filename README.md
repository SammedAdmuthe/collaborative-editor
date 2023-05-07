# collaborative-editor

To Run the project follow below steps:-

1. Install latest and start Redis on your local machine.
2. Clone this repository on multiple servers where you want to host the application.
3. Install HAProxy on your local machine. Configure HAProxy load balancer using haproxy.cfg file provided in repository(/HAProxy/haproxy.cfg). Provide IP address of        machines where you have hosted this application in haproxy.cfg file.
4. Run node server.js on all the servers where application is hosted.
5. The application is up and running.
