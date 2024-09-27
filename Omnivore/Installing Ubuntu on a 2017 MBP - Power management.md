---
id: e710287d-f34c-4be5-9a83-d0190b126151
title: Installing Ubuntu on a 2017 MBP - Power management
tags:
  - RSS
date_published: 2024-09-13 00:00:00
---

# Installing Ubuntu on a 2017 MBP - Power management
#Omnivore

[Read on Omnivore](https://omnivore.app/me/installing-ubuntu-on-a-2017-mbp-power-management-191eda07e02)
[Read Original](https://pjg1.site/mbp-linux-power)



Continuing from the [previous post](https:&#x2F;&#x2F;pjg1.site&#x2F;mbp-linux-wifi), there were two other issues I faced after installing Ubuntu:

* The battery drained super quickly despite less usage
* The laptop would get warm and remain warm even when the system was idle

I didn&#39;t get any warnings regarding battery life or heat issues from the family member I got the laptop from, neither was I using the laptop enough for it to be this warm or use this much power.

Solving this wasn&#39;t as straightforward as the fixing WiFi, becuase the searches didn&#39;t lead to any one single solution. So I had to debug my way through this somehow.

## Finding a starting point

I started by finding ways to see the temperature of my laptop, for which I found a package called &#x60;lm-sensors&#x60;. Before checking the temps, I ran &#x60;sensors-detect&#x60; and selected all of the default options.

&#x60;&#x60;&#x60;elixir
$ sudo apt install lm-sensors
$ sudo sensors-detect
&#x60;&#x60;&#x60;

When I ran &#x60;sensors&#x60; for the first time, there was too much output and it barely made sense. I spent some time deciphering the output, and then came the second problem - I didn&#39;t know the ideal temperatures to know which ones were high.

So I tried a different approach. I decided to capture the &#x60;sensors&#x60; output twice - once after boot, and one 30mins after that - and compare the two. In those 30mins, I tried to keep the system idle or used it minimally.

This approach worked, as I saw a difference in &#x60;coretemp-isa-0000&#x60;, which shows the temperatures of the CPU cores:

&#x60;&#x60;&#x60;angelscript
coretemp-isa-0000
Adapter: ISA adapter
Package id 0:  +45.0°C
...
&#x60;&#x60;&#x60;

After boot

&#x60;&#x60;&#x60;angelscript
coretemp-isa-0000
Adapter: ISA adapter
Package id 0:  +55.0°C
...
&#x60;&#x60;&#x60;

30mins after boot

&#x60;Package id 0&#x60; refers to the temperature of the CPU as a whole, and there is a 10 degree increase in about 30mins, with little to no activity in that duration.

I was off to search again, and I landed with two possible causes of this:

1. Some process is hogging CPU
2. Bad power management of Linux on Macs

The first cause got eliminated pretty quickly, as I &#x60;htop&#x60; didn&#39;t show any process with a high CPU usage, and the CPU usage was also fairly low overall. Bad power management was a very common issue reported in online forums, and I knew my machine worked fine on macOS, so this seemed like a valid cause.

One of the tools I came across to enable better power management was &#x60;powertop&#x60;, that displays the energy usage of a system and offers default settings for better power management. I enabled the defaults using the &#x60;--auto-tune&#x60; flag after installing.

&#x60;&#x60;&#x60;elixir
$ sudo apt install powertop
$ sudo powertop --auto-tune
&#x60;&#x60;&#x60;

When &#x60;powertop&#x60; is run without any flags, it runs in a similar fashion to &#x60;top&#x60;, displaying the energy usage and other statistics that update in real time.

&#x60;&#x60;&#x60;yaml
The battery reports a discharge rate of:  14.5  W
The energy consumed was :  325  J
The estimated remaining time is 2 hours, 6 minutes

Summary: 123.1 wakeups&#x2F;second,  0.0 GPU ops&#x2F;seconds, 0.0 VFS ops&#x2F;sec and 3.1% CPU use

            Usage       Events&#x2F;s    Category       Description
        675.2 µs&#x2F;s      46.6        Timer          tick_sched_timer
          0.8 ms&#x2F;s      21.0        Interrupt      [79] amdgpu
...
&#x60;&#x60;&#x60;

Some things stood out here:

* The battery discharge rate seemed high
* As a result, the energy consumption was also high
* &#x60;amdgpu&#x60; was second highest in the energy usage list

The appearance of &#x60;amdgpu&#x60; seemed something to look into further, and saw that there was an option to disable it all together. I wasn&#39;t planning on doing any heavy-duty work on this machine, so it seemed like a reasonable solution if it would help reduce temperatures.

I started following [this tutorial](https:&#x2F;&#x2F;medium.com&#x2F;codeflu&#x2F;disabling-discrete-amd-graphics-card-in-linux-5d365738fc97), which first checks if you have two graphics on your system or not.

&#x60;&#x60;&#x60;angelscript
$ lspci | grep VGA
01:00.0 VGA compatible controller: Advanced Micro Devices, Inc. [AMD&#x2F;ATI] Baffin [Radeon RX 460&#x2F;560D &#x2F; Pro 450&#x2F;455&#x2F;460&#x2F;555&#x2F;555X&#x2F;560&#x2F;560X] (rev ff)
&#x60;&#x60;&#x60;

I don&#39;t see a second GPU, but [this machine](https:&#x2F;&#x2F;support.apple.com&#x2F;en-us&#x2F;111947) has two GPUs - an integrated GPU and a discrete&#x2F;dedicated GPU.

OH WAIT, I found the root cause - the iGPU didn&#39;t get detected for whatever reason, and the dGPU is being used as the main graphics driver in its place. The dGPU uses a lot of power, which explains the the high energy usage in &#x60;powertop&#x60;, the quick battery drain and the laptop getting warm!

Other people have also [faced the same issue](https:&#x2F;&#x2F;github.com&#x2F;Dunedan&#x2F;mbp-2016-linux&#x2F;issues&#x2F;6) and have documented solutions for it, which I followed along.

## Enabling the iGPU

The iGPU is not detected thanks to the way Apple&#39;s firmware works. If it recognizes that it&#39;s booting an OS other than macOS, it will power down some of the hardware, the iGPU being one of them. Thanks Apple!

The TL;DR solution to this is to make the firmware believe that it is booting macOS by running custom code before boot.

### Step 1: Build the custom EFI code

The custom code is available in the [apple\_set\_os.efi](https:&#x2F;&#x2F;github.com&#x2F;0xbb&#x2F;apple%5Fset%5Fos.efi) repository. All I had to do was build the file.

&#x60;&#x60;&#x60;jboss-cli
$ git clone https:&#x2F;&#x2F;github.com&#x2F;0xbb&#x2F;apple_set_os.efi
$ cd apple_set_os.efi
$ make
cc -I&#x2F;usr&#x2F;include&#x2F;efi -I&#x2F;usr&#x2F;include&#x2F;efi&#x2F;x86_64 -DGNU_EFI_USE_MS_ABI -fPIC -fshort-wchar -ffreestanding -fno-stack-protector -maccumulate-outgoing-args -Wall -Dx86_64 -Werror -m64 -mno-red-zone   -c -o apple_set_os.o apple_set_os.c
ld -T &#x2F;usr&#x2F;lib&#x2F;elf_x86_64_efi.lds -Bsymbolic -shared -nostdlib -znocombreloc &#x2F;usr&#x2F;lib&#x2F;crt0-efi-x86_64.o -o apple_set_os.so apple_set_os.o &#x2F;usr&#x2F;lib&#x2F;gcc&#x2F;x86_64-linux-gnu&#x2F;11&#x2F;libgcc.a \
&#x2F;usr&#x2F;lib&#x2F;libgnuefi.a
objcopy -j .text -j .sdata -j .data -j .dynamic -j .dynsym -j .rel \
        -j .rela -j .reloc -S --target&#x3D;efi-app-x86_64 apple_set_os.so apple_set_os.efi
rm apple_set_os.o apple_set_os.so
&#x60;&#x60;&#x60;

### Step 2: move the code to the boot partition

Next, the code needs to be in a location that is accessible during boot, aka the boot partition. I can put the code in &#x60;&#x2F;boot&#x2F;efi&#x2F;EFI&#x60; directly too, but the instructions I was following put this in a sub-directory called &#x60;custom&#x60; instead.

&#x60;&#x60;&#x60;awk
$ sudo mkdir &#x2F;boot&#x2F;efi&#x2F;EFI&#x2F;custom
$ sudo cp apple_set_os.efi &#x2F;boot&#x2F;efi&#x2F;EFI&#x2F;custom
&#x60;&#x60;&#x60;

### Step 3: Ask GRUB to run the code before boot

Placing the code in the boot partition alone isn&#39;t enough, I needed to add instructions to run the code before boot somewhere. That somewhere is the bootloader configuration, which in this case is GRUB. I added the following lines to a file created for users to add custom configurations: &#x60;&#x2F;etc&#x2F;grub.d&#x2F;40_custom&#x60;:

&#x60;&#x60;&#x60;pgsql
$ cat &lt;&lt;EOF &gt;&gt; &#x2F;etc&#x2F;grub.d&#x2F;40_custom
search --no-floppy --set&#x3D;root --file &#x2F;EFI&#x2F;custom&#x2F;apple_set_os.efi
chainloader &#x2F;EFI&#x2F;custom&#x2F;apple_set_os.efi
boot
EOF
&#x60;&#x60;&#x60;

The GRUB menu display was disabled on my machine. To be able to debug any issues on boot, I made the following changes to &#x60;&#x2F;etc&#x2F;default&#x2F;grub&#x60;:

&#x60;&#x60;&#x60;ini
# Comment the following line
# GRUB_TIMEOUT_STYLE&#x3D;hidden

# Change the timeout value
GRUB_TIMEOUT&#x3D;10

# Uncomment the following lines
GRUB_TERMINAL&#x3D;console
GRUB_GFXMODE&#x3D;640x480
&#x60;&#x60;&#x60;

Then I ran &#x60;sudo update-grub&#x60; to save the changes.

### Step 4: Switch to using the iGPU on boot

This is done using a shell script called [gpu-switch](https:&#x2F;&#x2F;github.com&#x2F;0xbb&#x2F;gpu-switch) that writes the required values to an EFI variable to use the iGPU. The changes were applied on the next boot, so I rebooted the machine.

&#x60;&#x60;&#x60;shell
$ git clone https:&#x2F;&#x2F;github.com&#x2F;0xbb&#x2F;gpu-switch
$ cd gpu-switch
$ sudo .&#x2F;gpu-switch -i
$ sudo reboot now
&#x60;&#x60;&#x60;

After rebooting, the iGPU now appears in the &#x60;lspci&#x60; output!

&#x60;&#x60;&#x60;angelscript
$ lspci | grep VGA
00:02.0 VGA compatible controller: Intel Corporation HD Graphics 630 (rev 04)
01:00.0 VGA compatible controller: Advanced Micro Devices, Inc. [AMD&#x2F;ATI] Baffin [Radeon RX 460&#x2F;560D &#x2F; Pro 450&#x2F;455&#x2F;460&#x2F;555&#x2F;555X&#x2F;560&#x2F;560X] (rev ff)
&#x60;&#x60;&#x60;

## Disable dGPU

The dGPU continued to run and warm up the laptop despite the iGPU being detected, so I disabled it with the following commands:

&#x60;&#x60;&#x60;groovy
$ echo OFF | sudo tee &#x2F;sys&#x2F;kernel&#x2F;debug&#x2F;vgaswitcheroo&#x2F;switch
$ sudo mobprobe -r amdgpu
&#x60;&#x60;&#x60;

And slowly, my laptop started to cool down. I checked the output of &#x60;sensors&#x60; after a while, and the temperatures were MUCH lower than with the dGPU enabled:

&#x60;&#x60;&#x60;angelscript
coretemp-isa-0000
Adapter: ISA adapter
Package id 0:  +42.0°C
...
&#x60;&#x60;&#x60;

The &#x60;powertop&#x60; output also reflected this:

&#x60;&#x60;&#x60;yaml
The battery reports a discharge rate of 7.60 W
The energy consumed was 151 J
The estimated remaining time is 8 hours, 35 minutes

Summary: 62.1 wakeups&#x2F;second,  0.0 GPU ops&#x2F;seconds, 0.0 VFS ops&#x2F;sec and 0.7% CPU use

            Usage       Events&#x2F;s    Category       Description
        100.0%                      Device         Audio codec hwC1D0: ATI
        491.8 µs&#x2F;s      27.3        Timer          tick_sched_timer
...
&#x60;&#x60;&#x60;

The battery discharge rate and energy consumption values were lower, battery life became longer and &#x60;amgdpu&#x60; no longer appeared at the top of the list!

Lastly, I created a systemd service to disable the dGPU on boot. Thanks to this, my machine remains cool throughout:

&#x60;&#x60;&#x60;ini
# disable-dgpu.service
[Unit]
Description&#x3D;Disable discrete GPU
Before&#x3D;display-manager.service

[Service]
Type&#x3D;oneshot
ExecStart&#x3D;&#x2F;usr&#x2F;sbin&#x2F;modprobe amdgpu
ExecStart&#x3D;&#x2F;bin&#x2F;sh -c &#39;echo OFF &gt; &#x2F;sys&#x2F;kernel&#x2F;debug&#x2F;vgaswitcheroo&#x2F;switch&#39;
ExecStart&#x3D;&#x2F;usr&#x2F;sbin&#x2F;modprobe -r amdgpu
RemainAfterExit&#x3D;yes
TimeoutSec&#x3D;0

[Install]
WantedBy&#x3D;multi-user.target
&#x60;&#x60;&#x60;

I remember being scared when I noticed these issues for the first time. I&#39;d been used to things &quot;just working&quot; on macOS and Windows, and this was the opposite of that. Going from a feeling of fear to slowly gaining the courage to fix stuff has felt great. I think I&#39;m less scared now.