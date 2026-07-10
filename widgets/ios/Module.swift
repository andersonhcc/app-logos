import ExpoModulesCore
import WidgetKit

public class ExpoWidgetsModule: Module {
  private let suiteName = "group.com.logosai.app.expowidgets"
  private let snapshotKey = "DailyVerseWidgetSnapshot"

  public func definition() -> ModuleDefinition {
    Name("ExpoWidgets")

    Function("setWidgetData") { (data: String) -> Void in
      let defaults = UserDefaults(suiteName: suiteName)
      defaults?.set(data, forKey: snapshotKey)
      defaults?.synchronize()

      if #available(iOS 14.0, *) {
        WidgetCenter.shared.reloadAllTimelines()
      }
    }
  }
}
