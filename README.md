# collaborative-editor

Demo Link - https://drive.google.com/file/d/1hijyQvoCDY_f72IJutL6gjdvIlBQV1w4/view?usp=sharing

Right way to run the project:-

1. Install latest and start Redis on your local machine/other dedicated machine.
2. Clone this repository on multiple servers where you want to host the application.
3. Install HAProxy on your other machine which would act as load balancer. Configure HAProxy load balancer using haproxy.cfg file provided in                                repository(/HAProxy/haproxy.cfg). Provide IP address of machines where you have hosted this application in haproxy.cfg file.
4. Run node server.js on all the servers where application is hosted.
5. The servers are up and running.
6. Using any client machine query the below url which points to load balancer.
   Replace loadbalancer_ip with IP address of load balancer machine - http://loadbalancer_ip:80
7. You will be redirected to RCollab application.

Alternatively, you can test this application on same machine using different port.
1. Redis running at port 6379.
2. Configure HAProxy.
3. Run the Server at respective port-
   e.g. Server 1(3000), Server 2(3001), Server 3(3003), .. so on.
 4. Hit -  http://localhost:80


Test Script (testScript.py) -</br>
1. Test folder contains test script.
2. Copy the logs generated (output3000.txt) for each server of 3 servers into test folder(e.g. currently test folder contains server logs from 3 servers)
3. Run the testScript.py - python3 testScript.py.
4. The script uses logs generated (e.g. output3000.txt, output3001.txt, output3008.txt) from the application to give fair estimate of different metrics.
