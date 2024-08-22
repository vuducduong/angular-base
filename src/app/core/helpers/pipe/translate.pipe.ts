import { Pipe, PipeTransform } from '@angular/core';

var rules: { [key: string]: string } = {
  'dashboard': 'ダッシュボード',
  'hydrogen_leak_detection_system': '水素漏れ検知システム',
  'display_all_detectors': '全検知器表示',
  'individual_detection': '個別検知',
  'setting': '設定',
  'user_id': 'ユーザーID',
  'password': 'パスワード',
  'log_in': 'ログイン',
  'log_out': 'ログアウト',
  'sensor_registration': 'センサー登録',
  'data_acquisition_screen': 'データ取得画面',
  'data_deletion_screen': 'データ削除画面',
  'alarm_value_setting': '警報値設定',
  'system': 'システム',
  'sensor_data_deletion': 'センサデータ削除',
  'delete': '削除',
  'renew': '更新',
  'period': '期間',
  'alarm_setting': '警報設定',
  'determine_whether_there_is': '判定有無',
  'graph_line_display': 'グラフ線表示有無',
  'registration': '登録',
  'autonomous_alarm_setting_value': '自主警報設定値',
  'on': 'ON',
  'off': 'OFF',
  'has_registered': '登録しました。',
  'signal_strength_collection': '電波強度収集',
  'sensor_data_collection': 'センサデータ収集',
  'output': '出力',
  'gw': 'GW',
  'gw_id': 'GWセンサID',
  'csv_export': 'CSV出力',
  'the_sensor_data_has_been_deleted': 'センサデータを削除されました。',
  'user': '一般',
  'admin': '管理者',
  'system_setting': 'システム設定',
  'account_management': 'アカウント管理',
  'name': '名前',
  'authority': '権限',
  'copy': 'コピー',
  'edit': '編集',
  'sensor': 'センサ',
  'sensor_name': 'センサ名',
  'selection': '選択',
  'information_copy_mode': 'の情報のコピーモードです。',
  'edit_information_mode': 'の情報の編集モードです。',
  'no_data': 'データなし',
  'cancel': 'キャンセル',
  'get_list': 'リスト取得',
  'place': '場所',
  'gw_name': 'GW名',
  'sensor_id': 'センサID',
  'sensor_mac_address': 'センサMAC Address',
  'choose': '選ぶ',
  'data_update': 'データ更新',
  'hydrogen_concentration': '水素濃度',
  'abnormal_condition_sensor': '状態異常',
  'abnormal_sensor': '警報',
  'voluntary_warning_sensor': '自主警報',
  'normal_sensor': '正常',
  'logout_successfully': '正常にログアウトしました',
  'hide': '非表示',
  'show': '表示',
  'x_axis_display_range': 'X軸(表示期間)',
  'y_axis_display_range': 'Y軸(表示範囲)',
  'one_minute': '1分',
  'ten_minutes': '10分',
  'thirty_minutes': '30分',
  'one_hour': '1時間',
  'one_day': '1日',
  'one_week': '1週',
  'one_month': '1月',
  'one_year': '1年',
  'copy_right': 'Copyright © YYYY PRIVATECH Inc. All Rights Reserved.',
  'license': 'ライセンスコード',
  'check': 'チェック',
  'security_code': 'セキュリティコード',
  'renew_your_license': 'ライセンスを更新しますか?',
  'login': 'ログイン',
  'success_list_retrieved': '成功。リストを取得しました。',

  //validation
  'required': 'が必須です。',
  'maximum_length': '最大長',
  'minimum_length': '最小長',
  'digit': '桁。',
  'incorrect_format': 'の形式が正しくありません。',
  'field_is_required': 'この項目は入力必須です。',
  'please_enter': 'を入力してください。',
  'alarm_setpoint': '警報設定値',
  'autonomous_alarm_setpoint': '自主警報設定値を入力してください。',
  'must_be_between_8_and_20_characters': '8文字から20文字にしてください。',
  'please_enter_in_a_valid_format': '有効な書式で入力してください。',
  "name_already_exists": "この名前は既に存在します。別の値を入力してください。",
  "max_character_limit": "個以上の文字を入力できない。",
  "failed_get_sensor_data": "センサーのデータ取得に失敗しました。",
  "license_invalid_format": "ライセンスキーの形式が正しくありません",

  //messages dialog
  'delete_successfully': 'データは正常に削除されました。',
  'save_successfully': 'データは正常に保存されました。',
  'update_successfully': 'データは正常に更新されました。',
  'update_in_database': 'データベース内で更新しますか？',
  'register_in_database': 'データベースに登録します？',
  'delete_in_database': 'データベースから削除しますか？',

  //Jwt messages
  'server_connection_lost': 'サーバーへの接続が失われました.',
  'invalid_data': '無効なデータ.',
  'access_is_not_permitted': 'アクセスは許可されていません.',
  'conflict': '対立.',
  'internal_server_error': '内部サーバーエラー.',
  'unknown_error': '不明なエラー.',
  'service_unavailable': 'サービス利用不可.',
}

@Pipe({
  name: 'translate'
})

export class JapaneseTranslatePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if (rules[value]) {
      return rules[value];
    }
    return value;
  }
}

export function getTranslation(key: string): string {
  if (rules[key]) {
    return rules[key];
  }
  return key;
}
