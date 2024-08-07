---
id: ba040a32-1ee4-470b-ae9d-dec39a9d6237
---

# Enable Hibernate on Pop OS :: Notes
#Omnivore

[Read on Omnivore](https://omnivore.app/me/enable-hibernate-on-pop-os-notes-18e275ebeda)
[Read Original](https://abskmj.github.io/notes/posts/pop-os/enable-hibernate/)


## Prerequisites[⌗](#prerequisites)

## Check if the kernel supports Hibernation[⌗](#check-if-the-kernel-supports-hibernation)

It should list &#x60;disk&#x60; as an option on the list

## Check if a Swap file or partition is available[⌗](#check-if-a-swap-file-or-partition-is-available)

If &#x60;Swap&#x60; is listed as 0, it means a swap is not available and needs to be created.

## Create a Swap file[⌗](#create-a-swap-file)

* Create a swap file.

&#x60;6G&#x60; can be updated with a recommended swap size for the machine which is listed under &#x60;How much swap do I need?&#x60; section at [help.ubuntu.com](https:&#x2F;&#x2F;help.ubuntu.com&#x2F;community&#x2F;SwapFaq)

* Permissions
* Format as swap
* Activate the swap

## Configure Hibernation[⌗](#configure-hibernation)

List the swap

* Swap file is generally listed as &#x60;&#x2F;swapfile&#x60;
* Swap partition is listed as &#x60;&#x2F;dev&#x2F;sdxx&#x60;

## Swap UUID[⌗](#swap-uuid)

Get the UUID for the swap

It looks something like below

&#x60;&#x60;&#x60;ebnf
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

&#x60;&#x60;&#x60;

## Swap offset[⌗](#swap-offset)

This is only needed when a swap file is available. Get the offset

It looks something like below

&#x60;&#x60;&#x60;angelscript
9999999..

&#x60;&#x60;&#x60;

## Update Kernel Options[⌗](#update-kernel-options)

For a Swap File

For a Swap Partition, &#x60;resume_offset&#x60; option is not needed

Add below line to &#x60;&#x2F;etc&#x2F;initramfs-tools&#x2F;conf.d&#x2F;resume&#x60;. Create the file if not present

For a Swap File

&#x60;&#x60;&#x60;routeros
resume&#x3D;UUID&#x3D;xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx resume_offset&#x3D;9999999

&#x60;&#x60;&#x60;

For a Swap Partition

&#x60;&#x60;&#x60;ini
resume&#x3D;UUID&#x3D;xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

&#x60;&#x60;&#x60;

Update the configurations

## Test Hibernation[⌗](#test-hibernation)

Remember to save your work before trying this out

## References[⌗](#references)

* SwapFaq at [help.ubuntu.com](https:&#x2F;&#x2F;help.ubuntu.com&#x2F;community&#x2F;SwapFaq)
* Guide to hibernate? [pop-planet.info](https:&#x2F;&#x2F;pop-planet.info&#x2F;forums&#x2F;threads&#x2F;guide-to-hibernate-answer-is-a-guide.426&#x2F;)