---
title: 使用Snapper对Arch进行备份
date: 2024-12-08 18:22:03
tags: ARCH Linux
categories: Linux
index_img: https://raw.githubusercontent.com/uiuiqkjn/Blog-Pic/main/images/截屏2026-03-19_22.20.34_1773930220429_0.png
excerpt: 由于之前 ARCH Linux 系统内核崩溃且忘记备份导致数据丢失，本文介绍如何使用 snapper 备份数据。
---
## 1. 安装Snapper包

```bash
pacman -S snapper
```

根据wiki中的建议，还可以安装GUI 前端 [snapper-gui-git](https://aur.archlinux.org/packages/snapper-gui-git/)、[btrfs-assistant](https://aur.archlinux.org/packages/btrfs-assistant/) 或 [snapper-tools](https://aur.archlinux.org/packages/snapper-tools/).

## 2. 建立snapper配置

在 Btrfs 中，snapper 是以子卷为单位管理快照的。我们要先为子卷建立配置文件才能管理快照.

首先为snpper创建初始配置文件，这里我们不额外划分子卷，直接以 Btrfs 挂载点的根目录来进行操作.

```bash
snapper -c cfg_root create-config -f btrfs /
```

这个指令将创建一个名为`cfg_root`的配置文件，备份文件类型为btrfs，备份根分区.

`cfg_root`路径一般位于 `/etc/snapper/configs/`，用户可以自行修改配置文件设置快照限制.

此时，配置文件已经激活，snapper将会自动按时创建快照.

## 3. 创建快照

### 3.1自动按时创建快照

使用`cron`守护进程或者启用`snapper-timeline.timer`都可以自动按时创建快照，另外，启用`snapper-cleanup.timer` 来定期清理老旧快照.方法参照[Snapper](https://wiki.archlinuxcn.org/wiki/Snapper).

### 3.2手动创建快照

```bash
snapper -c cfg_root create
```

### 3.3其他常用快照相关指定

创建前快照：

```bash
sudo snapper create -t pre
```

创建后快照（需指定前快照编号）：

```bash
sudo snapper create -t post --pre-number <前快照编号>
```

创建带描述的快照：

```bash
sudo snapper create -t single --description "系统快照"
```

列出当前配置的所有快照：

```bash
sudo snapper list
```

列出指定配置的快照：

```bash
sudo snapper -c <配置名称> list
```

列出所有配置的快照：

```bash
sudo snapper list -a
```

删除指定编号的快照：

```bash
sudo snapper delete <快照编号>
```

删除多个快照：

```bash
sudo snapper delete <快照编号1> <快照编号2>
```

显示两个快照之间的更改：

```bash
sudo snapper status <快照编号1>..<快照编号2>
```

显示指定文件的差异：

```bash
sudo snapper diff <快照编号1>..<快照编号2> <文件路径>
```

撤销指定快照间的更改：

```bash
sudo snapper undochange <快照编号1>..<快照编号2> <文件路径>
```

回滚到指定快照：

```bash
sudo snapper rollback <快照编号>
```

其他指令自行参照官方文档，这里不再给出.

## 4.常见需求

### 如何指定快照保存路径？

对于个人系统而言，`/` 与 `/home`通常挂载在不同卷上面，为了节约 `/` 的空间，通常选择将快照保存在 `/home` 中.





## Reference

1. [Arch wiki for Snapper](https://wiki.archlinuxcn.org/wiki/Snapper)

2. [用 snapper 轻松玩转 Btrfs 的快照功能](https://zhuanlan.zhihu.com/p/31082518)
3. [Snapper 快照管理工具](https://tomoku-dm.github.io/2018/06/17/2-snapper/)

## 写在最后

### 为什么使用Snapper？

Arch Linux 是滚动更新的系统，用户经常在更新后出现问题，而Snapper可以为系统在安装/升级前后做快照，如果安装/升级失败，就可以快速的恢复系统到正常状态. 

对于Arch Linux新用户建议阅读[《建议阅读/给新用户的关于如何不去弄坏 Arch Linux 系统的建议》](https://wiki.archlinuxcn.org/zh/%E5%BB%BA%E8%AE%AE%E9%98%85%E8%AF%BB/%E7%BB%99%E6%96%B0%E7%94%A8%E6%88%B7%E7%9A%84%E5%85%B3%E4%BA%8E%E5%A6%82%E4%BD%95%E4%B8%8D%E5%8E%BB%E5%BC%84%E5%9D%8F_Arch_Linux_%E7%B3%BB%E7%BB%9F%E7%9A%84%E5%BB%BA%E8%AE%AE)以减少系统出错的概率.

