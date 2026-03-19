import os
import tensorflow as tf
import sys

# Add app to path so we can import the model
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from app.models.efficientnet_model import build_efficientnet_model

# Dataset dir
DATASET_DIR = "/home/dinesh/AI-Projects/FruiQ-AI/FruitVision A Benchmark Dataset for Fresh, Rotten, and Formalin-mixed Fruit Detection/Original Image/Fruits Original"

def get_label(file_path):
    parts = tf.strings.split(file_path, os.path.sep)
    condition = parts[-2]
    
    # labels: 0=Fresh, 1=Rotten, 2=Formalin-mixed
    label = tf.cond(condition == 'Fresh', lambda: 0,
            lambda: tf.cond(condition == 'Rotten', lambda: 1,
            lambda: tf.cond(condition == 'Formalin-mixed', lambda: 2, lambda: 0)))
    
    label_one_hot = tf.one_hot(label, 3)
    
    # Score mapping: Fresh: 1.0, Formalin-mixed: 0.0, Rotten: 0.0
    score = tf.cond(condition == 'Fresh', lambda: 1.0,
            lambda: tf.cond(condition == 'Rotten', lambda: 0.0,
            lambda: tf.cond(condition == 'Formalin-mixed', lambda: 0.0, lambda: 1.0)))
    
    return {'classification_head': label_one_hot, 'freshness_head': score}

def process_path(file_path):
    label_dict = get_label(file_path)
    img = tf.io.read_file(file_path)
    # decode_image can handle jpeg, png, etc.
    img = tf.image.decode_image(img, channels=3, expand_animations=False)
    img.set_shape([None, None, 3])
    img = tf.image.resize(img, [224, 224])
    # EfficientNetV2 expects [0, 255] inputs
    return img, label_dict

def prepare_dataset(batch_size=32):
    # Match all image files and use fixed seed for deterministic train/val split
    list_ds = tf.data.Dataset.list_files(os.path.join(DATASET_DIR, "*", "*", "*.*"), shuffle=True, seed=42)
    
    # Filter only valid images manually (ignoring desktop.ini etc.)
    def is_valid_image(filepath):
        # We can just filter out desktop.ini
        return tf.strings.regex_full_match(filepath, ".*\\.(jpg|jpeg|png|JPG|JPEG|PNG)")
    
    list_ds = list_ds.filter(is_valid_image)
    
    # Using 80-20 split
    ds_size = list_ds.cardinality().numpy()
    if ds_size == tf.data.experimental.UNKNOWN_CARDINALITY or ds_size < 0:
        # Fallback if unknown size
        ds_size = 5410
        
    val_size = int(ds_size * 0.2)
    train_ds = list_ds.skip(val_size)
    val_ds = list_ds.take(val_size)
    
    def configure_for_performance(ds):
        ds = ds.map(process_path, num_parallel_calls=tf.data.AUTOTUNE)
        ds = ds.batch(batch_size)
        ds = ds.prefetch(buffer_size=tf.data.AUTOTUNE)
        return ds
        
    return configure_for_performance(train_ds), configure_for_performance(val_ds)

from tqdm.keras import TqdmCallback

def train_pipeline():
    print("Starting training pipeline...")
    train_ds, val_ds = prepare_dataset(batch_size=32)
    
    print("Building model...")
    model = build_efficientnet_model(input_shape=(224, 224, 3), num_classes=3)
    
    model.compile(
        optimizer='adam',
        loss={
            'classification_head': 'categorical_crossentropy',
            'freshness_head': 'mse'
        },
        metrics={
            'classification_head': 'accuracy',
            'freshness_head': 'mae'
        }
    )
    
    # Callbacks
    model_dir = os.path.join(os.path.dirname(__file__), '..', 'models', 'trained')
    os.makedirs(model_dir, exist_ok=True)
    
    callbacks = [
        tf.keras.callbacks.ModelCheckpoint(
            filepath=os.path.join(model_dir, 'efficientnet_v2.keras'),
            save_best_only=True,
            monitor='val_classification_head_accuracy',
            mode='max'
        ),
        tf.keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True),
        TqdmCallback(verbose=1)
    ]
    
    print("Starting training (this may take a while)...")
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=10, 
        callbacks=callbacks,
        verbose=0
    )
    print("Training finished! Best model saved to:", os.path.join(model_dir, 'efficientnet_v2.keras'))

if __name__ == "__main__":
    import logging
    tf.get_logger().setLevel(logging.ERROR)
    train_pipeline()
