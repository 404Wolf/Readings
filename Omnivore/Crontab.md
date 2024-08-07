---
id: 43b70597-bf92-406b-a515-0fe51dd679a8
title: Crontab
tags:
  - RSS
date_published: 2024-07-25 14:03:23
---

# Crontab
#Omnivore

[Read on Omnivore](https://omnivore.app/me/crontab-190eb89716c)
[Read Original](https://elijer.github.io/garden/Dev-Notes/Crontab)



&gt; I will leave this up but I didn’t totally get this working. I got a test working in which I was printing a log message every x amount of time, but what I really wanted to do was run the command &#x60;npx quartz sync&#x60; and although it ran fine with &#x60;source thatscript.sh&#x60;, it did not run correctly in the cronjob. The only theory I had left was that the $PATH in the crontab environment is different from that of my normal command-line environment.

There is apparently a program in mac called crontab! It’s really simple to use.

1. Create a &#x60;.crontab&#x60; file in your user&#x2F;home directory.
2. Put a crontab command in, like \* \* \* \* \* &#x2F;path&#x2F;to&#x2F;your&#x2F;script.sh
3. Whatever script you direct this command to will run as specified
4. Probably just put the script in your &#x60;$HOME&#x2F;bin&#x60; directory. Make sure your &#x60;$HOME&#x2F;bin&#x60; directory is in your &#x60;$PATH&#x60;.

Cron is format that specifies when a job should run.&#x60;* * * * *&#x60; is a job that runs every minute&#x60;0 6 * * *&#x60; would run every day at 6am.

Set permissions to that script with&#x60;chmod +x &#x2F;path&#x2F;to&#x2F;your&#x2F;script.sh&#x60;

Now tell &#x60;crontab&#x60; what file to use. Just hop over to your home directory and execute &#x60;crontab .crontab&#x60;. You may have to prefix this with &#x60;sudo&#x60;. You always may have to accept to a dialog box by your OS asking if you trust &#x60;Terminal&#x60; or whatever is running your shell to manipulate your operating system

&gt; WARNING: Causing a script to run every x minutes or hours can definitely be dangerous - make sure you know what the script does. And also that you are sure how frequently you are running it, and that frequency is going to be okay. If you intend to run a script that runs once every week, maybe briefly consider, what would happen if this ran every minute?

You can check any active jobs with &#x60;crontab -l&#x60;.

## Result

I never actually go this working. I think there may have been a permissions issue, as this script isn’t run from my normal user account.

---