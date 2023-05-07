# collaborative-editor

Right way to run the project:-

1. Install latest and start Redis on your local machine/dedicated machine.
2. Clone this repository on multiple servers where you want to host the application.
3. Install HAProxy on your other machine which would act as load balancer. Configure HAProxy load balancer using haproxy.cfg file provided in                                repository(/HAProxy/haproxy.cfg). Provide IP address of machines where you have hosted this application in haproxy.cfg file.
4. Run node server.js on all the servers where application is hosted.
5. The servers are up and running.
6. Using any client machine query the below url which points to load balancer.
   Replace loadbalancer_ip with IP address of load balancer machine.
   http://loadbalancer_ip:80
7. You will be redirected to RCollab application.

   
