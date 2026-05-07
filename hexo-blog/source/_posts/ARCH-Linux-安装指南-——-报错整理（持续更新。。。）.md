---
title: ARCH Linux 安装指南 —— 报错整理
date: 2024-12-07 18:21:45
tags: ARCH Linux
categories: Linux

index_img: https://raw.githubusercontent.com/uiuiqkjn/Blog-Pic/main/images/截屏2026-03-19_22.20.34_1773930220429_0.png
excerpt: 一些在 ARCH Linux 上遇到的问题，解决方法如本文所述。
---

### 1.  NVIDIA  驱动安装

###### 安装 NVIDIA 相关驱动

```bash
sudo pamcan -Syu

sudo pacman -S nvidia-open nvidia-settings lib32-nvidia-utils 
```

###### 禁用内核中的 nouveau 模块

方法一： 

```bash
sudo vim /etc/mkinitcpio.conf  # 在 mkinitcpio.conf 中 HOOKS 一行删除 kms 并保存

sudo mkinitcpio -P 

reboot
```

方法二： 

```bash
sudo vim /etc/default/grub  # 在 GRUB_CMDLINE_LINUX_DEFAULT="" 中加入 nomodeset nouveau.modeset=0 

sudo grub-mkconfig -o /boot/efi/EFI/GRUB/grub.cfg

reboot
```



> 在重新生成 grub 时，记得提前挂载 efi 分区，否则重新生成的 grub 配置文件无效

重启电脑后，终端运行 nvidia-settings 查看显卡信息，观察 NVIDIA 驱动是否启用。

### 2.  Timeshift 与 Snapper

###### Timeshift：

对于使用 Timeshift 创建 btrfs 格式的快照，必须按照 ubuntu 格式创建子卷，否则会无法创建快照，具体步骤按照[官方教程](https://github.com/linuxmint/timeshift)所示。

###### Snapper

对于使用 Snapper 创建 btrfs 格式的快照。

```bash
snapper -c config_name create-config -f btrfs /  
# 为根卷创建snapper的配置文件 
# config_name 是配置文件的文件名，需要自己定义

snapper -c config_name create -c number --d “desc” 
# 使用 number 清理算法创建快照

snapper -c config_name --utc list 
# 以UTC方式显示日期和时间，查看创建的快照

snapper -c config_name undochange Num
# 将根卷下所有文件回滚到Num号快照状态
```


> 在指定需要创建快照的卷之前，需要将其挂载

其他命令参考 [Snapper](https://wiki.archlinux.org/title/Snapper)。

### 3.  系统时间、时区设置

使用 timedatectl 指令查看时间

```bash
timedatectl
```

输出类似

```bash
               Local time: Sat 2024-12-07 16:19:21 HKT       # 本地时间
           Universal time: Sat 2024-12-07 08:19:21 UTC       # 时间时间
                 RTC time: Sat 2024-12-07 16:19:21           # 主板时间
                Time zone: Hongkong (HKT, +0800)
System clock synchronized: no
              NTP service: inactive
          RTC in local TZ: yes                                   
```


> 如果世界时间不是0时区时间，那么时区所对应的时间就会不正确！

**解决方法**

```bash
# 同步时间
sudo ntpdate pool.ntp.org

# 列出时区
timedatectl list-timezones 

# 选择时区
timedatectl set-timezone Hongkong

# 把主板时间同步为本地时间
sudo timedatectl set-local-rtc 1
```

> windows/arch 双系统切换后系统时间发生变化?

因为 windows 下直接使用硬件时钟，而 linux 下硬件时钟是UTC时间，系统进入 windows后，它会检查硬件时间，然后同步，这个过程会将硬件时间修改成当前的本地时间，这时候你再重启进入linux，由于设置问题linux会认为硬件时间是utc格式的，于是用utc格式将硬件时间表示出来。

### References

1. [archlinux 简明指南](https://arch.icekylin.online/)

2. [Snapper](https://wiki.archlinuxcn.org/wiki/Snapper)

3. [系统时间](https://bbs.archlinuxcn.org/viewtopic.php?id=5545)

 

 

 