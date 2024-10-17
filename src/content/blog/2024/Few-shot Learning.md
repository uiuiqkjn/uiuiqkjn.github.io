---
author: uiuiqkjn
pubDatetime: 2024-10-07T15:56:50.000Z
title: 小样本学习(Few-shot Learning，FSL)
postSlug: few-shot-learning
featured: True
ogImage: ""
tags:
  - python
  - cv
description: An unexpected Few-shot Learning task
---
# 小样本学习(Few-shot Learning，FSL)
### 1. 概念——什么是小样本学习

​	机器学习模型通常需要在足够大的训练数据集上进行训练，才能取得较好的预测效果。然而，小样本学习的目标是在有限的标记样本（通常只有几个）上进行学习，并能够识别新的、未见过的实例。

​	例如，假设我们有一个包含多个类别的数据集，包括猫、狗、老虎、人类和鸟类。我们的目标不是让模型具体识别出哪张图片是猫或人类，而是让模型能够理解不同类别之间的差异。现在，如果我们输入一张汽车的图片，虽然模型不知道这是一辆汽车，但当我们再输入两张汽车的图片时，尽管模型仍不清楚这些图片属于“汽车”这一类别，它可以很确定地告诉你这三张图片来自同一个类别，因为它们的特征相似。

![](https://github.com/uiuiqkjn/Blog-Pic/raw/main/myblog/%E5%B0%8F%E6%A0%B7%E6%9C%AC%E5%AD%A6%E4%B9%A0.png)



### 2. Support Set和Query

​	小样本学习数据集通常包括**支持集Support Set、查询集Query**。Query通常不会出现在Training Set中，我们需要给Query提供一个Support Set，通过对比Query和Support Set间的相似度，来预测Query属于哪一类别。

​	小样本分类准确率会受到Support Set中类别数量和样本数量的影响，随着类别数量增加，分类准确率会降低。随着每个类别样本数增加，分类会更准确

> [!NOTE]
>
> ***Support Set与Training Set的区别：***
>
> *Training Set是一个非常大的数据集，每一类均包含非常多张图片。训练集足够大，可以用来训练一个深度神经网络。Support Set非常小，每一类只包含一张或几张图片，不足以训练一个深度神经网络。Support Set用于在预测时提供额外信息，使得模型能够断出所属类别不在训练集中的Query图片的类别。*



### 3. Few-Shot Image Classification

​	对于该类问题的一个简单的思路，使用一个在图片覆盖域较为全面的数据集上训练的预训练模型进行迁移学习，提取Support Set和Query数据集中的最大可用信息，根据它们的共性确定分类。本文以`YOLOv8`为例，对其进行迁移学习，实现一个简单的Few-Shot Image Classification问题。

​	首先，定义一个特征提取器，利用 `YOLO`模型从图像的特定层提取深度特征。具体思路如下：

```python
# 特征提取器类
class FeatureExtractor:
    def __init__(self, model_path, layer_name_to_extract):
        self.model = YOLO(model_path)         
        self.features = {}                    
        self.layer_name_to_extract = layer_name_to_extract
        self._register_hooks()               
    
    # 钩子函数，用于提取特征
    def _hook_fn(self, module, input, output):
        layer_name = str(module)             
        self.features[layer_name] = output    
    
    # 注册钩子函数
    def _register_hooks(self):
        layers = list(self.model.named_modules())   
        for name, layer in layers:
            if self.layer_name_to_extract in name:  
                layer.register_forward_hook(self._hook_fn)   
    
    # 处理输入图像并进行前向传播
    def extract_features(self, image_path):
        image = Image.open(image_path)     

        input_tensor = preprocess(image).unsqueeze(0)   

        self.features.clear()                
        _ = self.model(input_tensor)          
        
        return self.features                  

```

​	接着，定义特征提取函数，提取指定层的特征，本文以`model.model.9.linear`层为例，可以通过打印模型结构确定该层的参数。

```python
# 定义特征提取函数
def extract_custom_features(model, image_path, layer_name):
    feature_extractor = FeatureExtractor(model_path=model, layer_name_to_extract=layer_name)
    features = feature_extractor.extract_features(image_path)
    features = features['Linear(in_features=1280, out_features=1000, bias=True)'] 

    return features.cpu().numpy() 
```

​	使用上述特征提取函数循环提取查询集和支持集特征，分别储存至`support_features[]`和`query_features[]`字典中。

​	计算特征的L2范数（欧氏距离），根据特征相似性对Support Set和Query进行匹配和分类。

对于两个特征，它们之间的 L2 范数公式为：

![](https://github.com/uiuiqkjn/Blog-Pic/raw/main/myblog/%E5%B0%8F%E6%A0%B7%E6%9C%AC%E5%AD%A6%E4%B9%A0%E5%85%AC%E5%BC%8F%E4%B8%80.png)

​	将得到的查询图像名称和预测类别添加到结果列表，并写入.csv文件中，根据预测正确率（accuracy）作为评分指标，得到模型评分。计算公式如下：
![](https://github.com/uiuiqkjn/Blog-Pic/raw/main/myblog/%E5%B0%8F%E6%A0%B7%E6%9C%AC%E5%AD%A6%E4%B9%A0%E5%85%AC%E5%BC%8F%E4%BA%8C.png)

​	我的验证集目录结构为：

```
├─ val

│  	├─ query

│  	└─ support

│     	├─ class_0

│  	  	├─ class_1

│  	  	├─ class_2  

│ 		... ...

│  	  	└─ class_10 
```

​	

> [!IMPORTANT]
>
> ***使用 `YOLOv8n` 的预训练模型，在我的数据集上可以达到  90% 的精度。***



### 4. 参考文章

-  [图文带你理解什么是Few-shot Learning](https://blog.csdn.net/qq_40210586/article/details/118544825)
-  [What is few-shot learning?](https://www.ibm.com/topics/few-shot-learning#:~:text=IBM-,What%20is%20few%2Dshot%20learning%3F,suitable%20training%20data%20is%20scarce.)
-  [范数（norm） 几种范数的简单介绍](https://blog.csdn.net/a493823882/article/details/80569888)



