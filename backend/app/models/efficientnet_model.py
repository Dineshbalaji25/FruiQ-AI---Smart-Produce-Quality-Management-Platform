import tensorflow as tf

def build_efficientnet_model(input_shape=(224, 224, 3), num_classes=3):
    """
    Builds the complete EfficientNetV2 model architecture for FruiQ.
    Includes classification and regression heads.
    """
    inputs = tf.keras.Input(shape=input_shape)
    base_model = tf.keras.applications.EfficientNetV2S(
        include_top=False,
        weights="imagenet",
        input_tensor=inputs
    )
    base_model.trainable = False
    
    x = tf.keras.layers.GlobalAveragePooling2D()(base_model.output)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Dropout(0.2)(x)
    
    # Classification Head
    class_output = tf.keras.layers.Dense(num_classes, activation="softmax", name="classification_head")(x)
    
    # Regression Head for freshness score
    reg_output = tf.keras.layers.Dense(1, activation="sigmoid", name="freshness_head")(x)
    
    model = tf.keras.Model(inputs=inputs, outputs=[class_output, reg_output])
    return model
