import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

interface IconProps {
  color?: string;
  size?: number;
}

/**
 * Envelope / Mail Icon built using pure React Native View shapes
 */
export const MailIcon: React.FC<IconProps> = ({ color = '#64748B', size = 18 }) => {
  const width = size;
  const height = Math.round(size * 0.72);

  return (
    <View
      style={[
        styles.iconContainer,
        {
          width,
          height,
          borderWidth: 1.6,
          borderColor: color,
          borderRadius: 3,
          overflow: 'hidden',
          justifyContent: 'flex-start',
          alignItems: 'center',
        },
      ]}
    >
      {/* Envelope flap chevron */}
      <View
        style={{
          width: Math.round(width * 0.7),
          height: Math.round(height * 0.7),
          borderBottomWidth: 1.6,
          borderLeftWidth: 1.6,
          borderColor: color,
          transform: [{ rotate: '-45deg' }, { translateY: -Math.round(height * 0.3) }],
        }}
      />
    </View>
  );
};

/**
 * Lock Icon with shackle and body
 */
export const LockIcon: React.FC<IconProps> = ({ color = '#64748B', size = 18 }) => {
  const width = size;
  const height = Math.round(size * 1.1);

  return (
    <View
      style={[
        styles.iconContainer,
        {
          width,
          height,
          alignItems: 'center',
          justifyContent: 'flex-end',
        },
      ]}
    >
      {/* Shackle */}
      <View
        style={{
          width: Math.round(width * 0.65),
          height: Math.round(height * 0.44),
          borderWidth: 1.8,
          borderColor: color,
          borderBottomWidth: 0,
          borderTopLeftRadius: Math.round(width * 0.35),
          borderTopRightRadius: Math.round(width * 0.35),
          marginBottom: -1,
        }}
      />
      {/* Body */}
      <View
        style={{
          width: Math.round(width * 0.9),
          height: Math.round(height * 0.58),
          backgroundColor: color,
          borderRadius: 3,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Keyhole dot */}
        <View
          style={{
            width: 2,
            height: 4,
            backgroundColor: '#FFFFFF',
            borderRadius: 1,
          }}
        />
      </View>
    </View>
  );
};

/**
 * Eye Icon for password toggle
 */
export const EyeIcon: React.FC<{ isVisible: boolean; color?: string; size?: number }> = ({
  isVisible,
  color = '#64748B',
  size = 20,
}) => {
  const width = size;
  const height = Math.round(size * 0.65);

  return (
    <View
      style={[
        styles.iconContainer,
        {
          width,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
    >
      {/* Eye Contour */}
      <View
        style={{
          width,
          height,
          borderWidth: 1.6,
          borderColor: color,
          borderRadius: Math.round(width * 0.5),
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Pupil */}
        <View
          style={{
            width: Math.round(height * 0.45),
            height: Math.round(height * 0.45),
            borderRadius: Math.round(height * 0.25),
            backgroundColor: color,
          }}
        />
      </View>
      {/* Slash line if hidden */}
      {!isVisible && (
        <View
          style={{
            position: 'absolute',
            width: width + 2,
            height: 1.6,
            backgroundColor: color,
            transform: [{ rotate: '-45deg' }],
          }}
        />
      )}
    </View>
  );
};

/**
 * Arrow pointing right for button
 */
export const ArrowRightIcon: React.FC<IconProps> = ({ color = '#FFFFFF', size = 18 }) => {
  return (
    <Text
      style={{
        fontSize: size,
        color,
        fontWeight: 'bold',
        marginLeft: 4,
        lineHeight: size + 2,
      }}
    >
      →
    </Text>
  );
};

/**
 * Clean Google "G" icon with multi-color branding
 */
export const GoogleIcon: React.FC<{ size?: number }> = ({ size = 20 }) => {
  return (
    <View
      style={[
        styles.iconContainer,
        {
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: '#E2E8F0',
        }}
      >
        <Text
          style={{
            fontSize: Math.round(size * 0.65),
            fontWeight: '900',
            fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
            color: '#4285F4',
          }}
        >
          G
        </Text>
      </View>
    </View>
  );
};

/**
 * Apple Icon with Android compatibility fallback
 */
export const AppleIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 20,
  color = '#000000',
}) => {
  if (Platform.OS === 'ios') {
    return (
      <View
        style={[
          styles.iconContainer,
          {
            width: size,
            height: size,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <Text style={{ fontSize: size * 0.9, color, fontWeight: '600' }}></Text>
      </View>
    );
  }

  // Cross-platform vector Apple silhouette for Android/Web
  return (
    <View
      style={[
        styles.iconContainer,
        {
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
    >
      {/* Leaf */}
      <View
        style={{
          width: Math.round(size * 0.28),
          height: Math.round(size * 0.18),
          backgroundColor: color,
          borderRadius: 2,
          transform: [{ rotate: '45deg' }, { translateX: 2 }, { translateY: -1 }],
          marginBottom: 1,
        }}
      />
      {/* Body */}
      <View
        style={{
          width: Math.round(size * 0.75),
          height: Math.round(size * 0.72),
          backgroundColor: color,
          borderRadius: Math.round(size * 0.32),
          borderBottomLeftRadius: Math.round(size * 0.28),
          borderBottomRightRadius: Math.round(size * 0.28),
        }}
      />
    </View>
  );
};

/**
 * Shield Icon for security footer
 */
export const ShieldIcon: React.FC<IconProps> = ({ color = '#64748B', size = 14 }) => {
  const width = size;
  const height = Math.round(size * 1.15);

  return (
    <View
      style={[
        styles.iconContainer,
        {
          width,
          height,
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
    >
      <View
        style={{
          width,
          height: Math.round(height * 0.85),
          borderWidth: 1.4,
          borderColor: color,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          borderBottomLeftRadius: Math.round(width * 0.5),
          borderBottomRightRadius: Math.round(width * 0.5),
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Inner vertical core line */}
        <View
          style={{
            width: 1.4,
            height: Math.round(height * 0.4),
            backgroundColor: color,
            borderRadius: 0.7,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
