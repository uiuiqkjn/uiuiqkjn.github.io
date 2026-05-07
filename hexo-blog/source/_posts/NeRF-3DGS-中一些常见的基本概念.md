---
title: NeRF 与 3DGS 中一些常见的基本概念
date: 2026-01-19 13:01:44
tags: 笔记
categories: CG
index_img: https://raw.githubusercontent.com/uiuiqkjn/Blog-Pic/main/ImageBed/c3474433cde93e65877d7d03dd1cb46c.jpg
excerpt:  简要叙述在学习 NeRF 和 3DGS 时需要了解的一些基本概念。
---

## Positional Encoding 位置编码	

![c3474433cde93e65877d7d03dd1cb46c](https://raw.githubusercontent.com/uiuiqkjn/Blog-Pic/main/ImageBed/c3474433cde93e65877d7d03dd1cb46c.jpg)

## SfM (Structure from Motion 运动恢复结构)

![a65c012f6022345e03b052569587d03d](https://raw.githubusercontent.com/uiuiqkjn/Blog-Pic/main/ImageBed/a65c012f6022345e03b052569587d03d.jpg)

![668195eb6ec87ab3060c90778fbe8bd3](https://raw.githubusercontent.com/uiuiqkjn/Blog-Pic/main/ImageBed/668195eb6ec87ab3060c90778fbe8bd3.jpg)

![257eff862eba93432903f38d0c845fc1](https://raw.githubusercontent.com/uiuiqkjn/Blog-Pic/main/ImageBed/257eff862eba93432903f38d0c845fc1.jpg)

![3589c588f33add32a07ced3990b2d6d8](https://raw.githubusercontent.com/uiuiqkjn/Blog-Pic/main/ImageBed/3589c588f33add32a07ced3990b2d6d8.jpg)

### SfM 生成稀疏点云全流程

![be1eacb447c516cfdbd81f58136a83da](https://raw.githubusercontent.com/uiuiqkjn/Blog-Pic/main/ImageBed/be1eacb447c516cfdbd81f58136a83da.jpg)

在3DGS中，SfM采用的是Colmap方法，其流程如下

![screenshot_2026-01-19_18-57-46](https://raw.githubusercontent.com/uiuiqkjn/Blog-Pic/main/ImageBed/screenshot_2026-01-19_18-57-46.png)

## 3DGS 代码调试前一些相关知识

![feccfd7d31283f00b3741d71de385956](https://raw.githubusercontent.com/uiuiqkjn/Blog-Pic/main/ImageBed/feccfd7d31283f00b3741d71de385956.jpg)

![4d9bea05147bf109d4ab2cbe8a472cc4](https://raw.githubusercontent.com/uiuiqkjn/Blog-Pic/main/ImageBed/4d9bea05147bf109d4ab2cbe8a472cc4.jpg)

![95aefefa4c01d468a409e7b77caa7396](https://raw.githubusercontent.com/uiuiqkjn/Blog-Pic/main/ImageBed/95aefefa4c01d468a409e7b77caa7396.jpg)

## Reference

[三维重建入门到精通，30分钟教你学会运动恢复结构SFM](https://www.bilibili.com/video/BV1XP411q7yD/?spm_id_from=333.337.search-card.all.click&vd_source=11e85f20dc7ab80c17cc834885fa52ad)

[3D Gaussian Splatting代码调试之前的一些相关知识介绍(坐标变换|四元数|球谐函数)](https://www.bilibili.com/video/BV1K442197uW/?spm_id_from=333.1387.homepage.video_card.click&vd_source=11e85f20dc7ab80c17cc834885fa52ad)
