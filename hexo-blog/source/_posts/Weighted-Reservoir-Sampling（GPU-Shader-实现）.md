---
title: Weighted Reservoir Sampling（GPU Shader 实现）
date: 2026-04-01 11:11:54
tags: 论文复现
categories: CG
excerpt: 复限一个 GPU Shader 的 WRS 算法，使用glsl编程，在实际应用中可以用 C++ 读取。

---
# Weighted Reservoir Sampling（GPU Shader 实现）

## 一、说明

这是一个 **Weighted Reservoir Sampling 算法的 GPU 实现版本**，运行在 **GPU Shader Pipeline** 中，因此源码采用 `.glsl` 文件格式，而不是 `.cpp`。

## 二、Pipeline

1. 读取历史 reservoir
2. 读取邻域 reservoir
3. 选择最大权重 reservoir
4. 计算当前 sample 权重
5. 更新 reservoir
6. 写回 reservoir

## 三、算法实现

输出变量定义

```glsl
out vec4 FragColor;

// 结构示意
// struct Reservoir
// {
//     sample
//     weightSum
// }
```

输入变量 分辨率、注视点位置、历史样本缓冲区

```glsl
uniform vec2 resolution;
uniform vec2 gazePos;
uniform sampler2D reservoirBuffer;
```

定义随机数，用于选择当前样本 or 历史样本

```glsl
float rand(vec2 co)
{
    return fract(
        sin(dot(co,
        vec2(12.9898,78.233)))
        *43758.5453
    );
}
```

定义比较函数，用于比较两个 sample，返回权重较大的一个

```glsl
vec4 pickBetter(vec4 A, vec4 B)
{
    if(B.a > A.a)
        return B;

    return A;
}
```

在主函数中，首先获取当前像素坐标，范围 [0, 1]

```glsl
vec2 uv = gl_FragCoord.xy / resolution;
```


读取当前水库样本和周围四个邻近的样本

```glsl
vec4 reservoir = texture(reservoirBuffer, uv);

vec4 left  = texture(reservoirBuffer, uv + vec2(-1.0/resolution.x,0));
vec4 right = texture(reservoirBuffer, uv + vec2( 1.0/resolution.x,0));
vec4 up    = texture(reservoirBuffer, uv + vec2(0, 1.0/resolution.y));
vec4 down  = texture(reservoirBuffer, uv + vec2(0,-1.0/resolution.y));
```

选择权重最大的样本作为当前水库样本

```glsl
reservoir = pickBetter(reservoir,left);
reservoir = pickBetter(reservoir,right);
reservoir = pickBetter(reservoir,up);
reservoir = pickBetter(reservoir,down);
```

提取历史样本和权重

```glsl
vec3 historySample = reservoir.rgb;
float weightSum = reservoir.a;
```

基于gaze，计算当前像素的权重

```glsl
float dist = distance(uv, gazePos);
float weight = exp(-dist*6.0);
```

生成当前权重

```glsl
vec3 currentSample = vec3(weight);
```

合并当前 sample 与历史 sample，更新权重总和

```glsl
weightSum += weight;
```

根据权重概率随机选择当前样本或历史样本


```glsl
float probability = weight / weightSum;
float r = rand(gl_FragCoord.xy);

vec3 finalSample;
```

更新sample，写回水库

```glsl
if(r < probability)
    finalSample = currentSample;
else
    finalSample = historySample;
```

输出，写回 reservoir

```glsl
FragColor = vec4(finalSample, weightSum);
```
